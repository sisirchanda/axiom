const xlsx = require("xlsx");

const S = (v) => String(v ?? "").trim();
const U = (v) => S(v).toUpperCase();

const MARKERS = ["HEADER", "LINE", "DISCOUNT", "SET"];

function isBlankRow(row) {
  return !row || row.every((c) => S(c) === "");
}

function removeKeys(obj, keys) {
  const copy = { ...obj };
  for (const k of keys) delete copy[k];
  return copy;
}

/**
 * Reads a block table after a marker row.
 * Block format:
 *   <MARKER>  (in column B)
 *   header row: must have "Action" in column B
 *   data rows: until next marker row or end
 */
function readTable(grid, markerRow, markerCol) {
  if (markerRow < 0) {
	  return { rows: [], nextIndex: grid.length };
  }

  // find header row (cell in markerCol == "Action")
  let headerRow = -1;
  for (let r = markerRow + 1; r < grid.length; r++) {
    if (U(grid[r]?.[markerCol]) === "ACTION") {
      headerRow = r;
      break;
    }
    // Stop early if next marker appears (malformed block)
    if (MARKERS.includes(U(grid[r]?.[markerCol]))) {
		break;
	}
  }
  if (headerRow === -1) return { rows: [], nextIndex: markerRow + 1 };

  const header = (grid[headerRow] || []).map(S);
  const rows = [];

  let r = headerRow + 1;
  while (r < grid.length) {
    const cell = U(grid[r]?.[markerCol]);
    if (MARKERS.includes(cell)) {
		break;
	}
    if (!isBlankRow(grid[r])) {
      const obj = {};
      for (let c = 0; c < header.length; c++) {
        const key = header[c];
        if (!key) continue;
        obj[key] = grid[r][c];
      }
      rows.push(obj);
    }
    r++;
  }

  return { rows, nextIndex: r };
}

/**
 * parsePaymentTermsWorkbook(filePath[, sheetName]) -> termArray
 *
 * Each term is defined by repeating blocks:
 * HEADER -> LINE -> DISCOUNT -> SET
 *
 * Join rules:
 * - HEADER must have TermName
 * - LINE must have TermLine #
 * - DISCOUNT must have TermLine #
 * - SET has no join keys
 */
function parsePaymentTermsWorkbook(filePath, sheetName = null) {
  const wb = xlsx.readFile(filePath);
  const actualSheetName = sheetName || wb.SheetNames[0];
  const ws = wb.Sheets[actualSheetName];
  if (!ws) {
	  throw new Error(`Sheet not found: ${actualSheetName}`);
  }

  const grid = xlsx.utils.sheet_to_json(ws, { header: 1, defval: "" });

  const markerCol = 1; // Column B
  const terms = [];

  let i = 0;
  
  console.log("  grid.length :", grid.length);

  while (i < grid.length) {
    const cell = U(grid[i]?.[markerCol]);
	
	console.log("  grid[i] :", grid[i]);
	

    if (cell !== "HEADER") {
      i++;
      continue;
    }

    // ---------- HEADER ----------
    const headerBlock = readTable(grid, i, markerCol);
    const headerRows = headerBlock.rows;
    i = headerBlock.nextIndex;

    if (!headerRows.length) {
      throw new Error("Found HEADER marker but no header data rows.");
    }

    const headerRow = headerRows[0];
	console.log("  headerRow :", headerRow);
    const termName = S(headerRow["TermName"]);
    if (!termName) {
		throw new Error('HEADER block missing required column "TermName".');
	}

    const term = {
      termName,
      action: U(headerRow["Action"] || "CREATE"),
      headerFields: removeKeys(headerRow, ["Action", "TermName"]),
      lines: [],
      sets: [],
    };

    // We'll index lines so DISCOUNT can attach quickly
    const lineIndex = new Map(); // lineNo -> lineObj

    // ---------- LINE ----------
    if (U(grid[i]?.[markerCol]) === "LINE") {
      const lineBlock = readTable(grid, i, markerCol);
      const lineRows = lineBlock.rows;
      i = lineBlock.nextIndex;

      for (const lr of lineRows) {
        const lineNo = S(lr["TermLine #"]);
        if (!lineNo) {
			throw new Error(`LINE block missing required "TermLine #" for term "${termName}".`);
		}

        if (lineIndex.has(lineNo)) {
          throw new Error(`Duplicate TermLine # "${lineNo}" for term "${termName}".`);
        }

        const lineObj = {
          lineNo,
          action: U(lr["Action"] || "CREATE"),
          lineFields: removeKeys(lr, ["Action", "TermLine #"]),
          discounts: [],
        };

        lineIndex.set(lineNo, lineObj);
        term.lines.push(lineObj);
      }
    }

    // ---------- DISCOUNT ----------
    if (U(grid[i]?.[markerCol]) === "DISCOUNT") {
      const discBlock = readTable(grid, i, markerCol);
      const discRows = discBlock.rows;
      i = discBlock.nextIndex;

      for (const dr of discRows) {
        const lineNo = S(dr["TermLine #"]);
        if (!lineNo) {
			throw new Error(`DISCOUNT row missing "TermLine #" for term "${termName}".`);
		}

        const lineObj = lineIndex.get(lineNo);
        if (!lineObj) {
          throw new Error(`DISCOUNT references unknown TermLine # "${lineNo}" for term "${termName}".`);
        }

        if (lineObj.discounts.length >= 3) {
          throw new Error(`More than 3 discount rows for term "${termName}" line "${lineNo}".`);
        }

        lineObj.discounts.push({
          action: U(dr["Action"] || "CREATE"),
          discountFields: removeKeys(dr, ["Action", "TermLine #"]),
        });
      }
    }

    // ---------- SET ----------
    if (U(grid[i]?.[markerCol]) === "SET") {
      const setBlock = readTable(grid, i, markerCol);
      const setRows = setBlock.rows;
      i = setBlock.nextIndex;

      for (const sr of setRows) {
        term.sets.push({
          action: U(sr["Action"] || "ATTACH"),
          setFields: removeKeys(sr, ["Action"]),
        });
      }
    }

    terms.push(term);
  }

  return terms; // <-- as you requested: returns array
}

module.exports = { parsePaymentTermsWorkbook };