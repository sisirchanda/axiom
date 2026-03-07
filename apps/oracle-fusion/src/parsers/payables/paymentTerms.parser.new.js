const XLSX = require('xlsx');

/**
 * Parses Payment Terms Excel starting from Row 7 using Object Type triggers.
 */
function parsePaymentTermsWorkbook(filePath, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    
    // Scan from Row 7 (index 6). header: 1 returns a 2D Array [ [row1], [row2] ]
    const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 6, defval: null });

    // Initialize the Term Map
    const termsMap = new Map();

    allRows.forEach((row, index) => {
        // Identify Object Type (e.g., Header, Line, Discount, Set)
        // We look for these keywords in the first column (Index 0)
		//console.log(`--- Checking Excel Row ${index + 7} ---`);
		//console.log(row);
        const objectType = row[1] ? row[1].toString().trim().toLowerCase() : null;
        
        // Skip rows that are empty or literally say "Header" (Case 2: Ignore header row)
        if (!objectType || objectType === 'Object Type') return;

        // Logic for 'Term' (The Term definition)
        if (objectType === 'Term'.toLowerCase()) {
            const termName = row[2]; // Next cell is Term Name
            if (!termsMap.has(termName)) {
                termsMap.set(termName, {
					action: row[0],
                    termName: termName,
                    description: row[3] || '', // Column E
					rank: row[4] || '', 
					cutoffDay: row[5] || '', 
					fromDate: row[6] || '', 
					toDate: row[7] || '', 
                    sets: new Set(),
                    installments: new Map() // Nested map
                });
            }
        }

        // Step 4: Logic for 'Line'
        else if (objectType === 'Term Line'.toLowerCase()) {
            const termName = row[2]; // Find term by next cell
            const term = termsMap.get(termName);
            
            if (term) {
                const lineNo = row[3]; // Line # 
                term.installments.set(lineNo, {
					action: row[0] || '',
                    lineNo: lineNo || '',
                    due: row[4] || '', 
                    amountDue: row[5] || '',   
					calendar: row[6] || '',  
					fixedDate: row[7] || '',  
					days: row[8] || '',  
					daysOfMonth: row[9] || '',  
                    discounts: []  
                });
            }
        }

        // Step 5: Logic for 'Discount'
        else if (objectType === 'Discount'.toLowerCase()) {
            const termName = row[2]; // Find term by next cell
            const term = termsMap.get(termName);
            
            if (term) {
                const lineNo = row[3]; // Find line within term based on Line #
                const line = term.installments.get(lineNo);
                
                if (line) {
                    line.discounts.push({
						action: row[0] || '',
                        discLineNo: row[4] || '', 
                        firstDiscPct: row[5] || '',    
                        firstDiscDays: row[6] || '', 
						firstDiscDaysOfMonth: row[7] || '',	
                        secondDiscPct: row[8] || '',    
                        secondDiscDays: row[9] || '', 
						secondDiscDaysOfMonth: row[10] || '',
                        thirdDiscPct: row[11] || '',    
                        thirdDiscDays: row[12] || '', 
						thirdDiscDaysOfMonth: row[13] || ''						
                    });
                }
            }
        }

        // Step 6: Logic for 'Set'
        else if (objectType === 'Set'.toLowerCase()) {
            const termName = row[2]; // Find term by next cell
            const term = termsMap.get(termName);
            
            if (term && row[3]) {
                term.sets.add(row[3] || ''); // Set name
            }
        }
    });

    // Final Step: Convert Maps and Sets to standard Arrays for the Axiom engine
    return Array.from(termsMap.values()).map(term => ({
        ...term,
        sets: Array.from(term.sets),
        installments: Array.from(term.installments.values())
    }));
}

module.exports = { parsePaymentTermsWorkbook };