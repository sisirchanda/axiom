const xlsx = require("xlsx");

function parseExcelSheet(filePath, sheetName, map, requiredKeys = []) {
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);

  const raw = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const rows = raw.map((r) => {
    const out = {};
    for (const [excelCol, key] of Object.entries(map || {})) out[key] = r[excelCol];

    //out.Action = String(out.Action || "CREATE").trim().toUpperCase();
    //out.TermName = String(out.TermName || "").trim();
    //out.Description = String(out.Description || "").trim();

    //if (out.DueDays !== "" && out.DueDays != null) {
	//	out.DueDays = Number(out.DueDays);
	//}
    return out;
  });

  return rows.filter((row) =>
    requiredKeys.every((k) => String(row[k] ?? "").trim().length > 0)
  );
}

module.exports = { parseExcelSheet };