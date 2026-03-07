const path = require("path");

async function run(ctx, task) {
  const { logger, filePath } = ctx;

  logger.info("Reading PaymentTerms sheet...");
  
  const { parsePaymentTermsWorkbook} = require(task.parserPath)

  const terms = parsePaymentTermsWorkbook(filePath, task.sheet);
  logger.info(JSON.stringify(terms, null, 2));

  for (const row of terms) {
    if ((row.Action || "CREATE").toUpperCase() !== "CREATE") {
		continue;
	}
    await createPaymentTerm(ctx, row);
  }
}

async function setTermSet(ctx, setData) {
	
  const { page, logger } = ctx;
  logger.info("Setting SET information...");
  
  for (const setName of setData) {
	await page.getByRole('button', { name: 'Add Row' }).nth(1).click();
	await page.getByLabel('DspSetId').selectOption({ label: setName.toString() });
  }
}

async function setInstallment(ctx, installmentData) {
	
  const { page, logger } = ctx;
  logger.info("Setting Installment information...");
  
  for (const installment of installmentData) {
	logger.info(`Adding Installment Line: ${installment.lineNo}`);
	
	if (installment.action.toUpperCase() === 'CREATE'){
	
		await page.getByRole('button', { name: 'Add Row' }).first().click();
		
		await page.getByRole('textbox', { name: 'Due', exact: true }).click();
		await page.getByRole('textbox', { name: 'Due', exact: true }).fill(installment.due.toString());
		await page.getByRole('textbox', { name: 'Amount Due', exact: true }).click();
		await page.getByRole('textbox', { name: 'Amount Due', exact: true }).fill(installment.amountDue.toString());
		
		await page.getByLabel('Calendar').selectOption({ label: installment.calendar.toString() });
		
		await page.getByRole('textbox', { name: 'Fixed Date', exact: true  }).click();
		await page.getByRole('textbox', { name: 'Fixed Date', exact: true  }).fill(installment.fixedDate.toString());
		
		await page.getByRole('textbox', { name: 'Days', exact: true }).click();
		await page.getByRole('textbox', { name: 'Days', exact: true }).fill(installment.days.toString());
		
		await page.getByRole('textbox', { name: 'Day of Month', exact: true }).click();
		await page.getByRole('textbox', { name: 'Day of Month', exact: true }).fill(installment.daysOfMonth.toString());
		
  // 3. Loop through the 3 possible discounts
        for (let i = 0; i < installment.discounts.length; i++) {
          const disc = installment.discounts[i];
          const discIndex = i + 1; // 1, 2, or 3
        
          logger.info(`Setting Discount ${discIndex}:`);
          // Use the index to target the specific discount columns in the Oracle grid
		  
		  await page.getByRole('textbox', { name: 'First Discount Percentage' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'First Discount Percentage' }).fill(disc.firstDiscPct.toString());
		  
		  await page.getByRole('textbox', { name: 'First Discount Days' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'First Discount Days' }).fill(disc.firstDiscDays.toString());
		  
		  
		  await page.getByRole('textbox', { name: 'First Discount Day of Month' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'First Discount Day of Month' }).fill(disc.firstDiscDaysOfMonth.toString());
		  
		  await page.getByRole('textbox', { name: 'Second Discount Percentage' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Second Discount Percentage' }).fill(disc.secondDiscPct.toString());
		  
		  await page.getByRole('textbox', { name: 'Second Discount Days' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Second Discount Days' }).fill(disc.secondDiscDays.toString());
		  
		  await page.getByRole('textbox', { name: 'Second Discount Day of Month' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Second Discount Day of Month' }).fill(disc.secondDiscDaysOfMonth.toString());
		  
		  await page.getByRole('textbox', { name: 'Third Discount Percentage' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Third Discount Percentage' }).fill(disc.thirdDiscPct.toString());
		  
		  await page.getByRole('textbox', { name: 'Third Discount Days' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Third Discount Days' }).fill(disc.thirdDiscDays.toString());
		  
		  await page.getByRole('textbox', { name: 'Third Discount Day of Month' }).click({ force: true });
		  await page.getByRole('textbox', { name: 'Third Discount Day of Month' }).fill(disc.thirdDiscDaysOfMonth.toString());
		  
       }
	}
  }
}

async function createPaymentTerm(ctx, row) {
  const { page, logger } = ctx;

  logger.info(`Creating Payment Term: ${row.termName}`);

  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(row.termName.toString());
  
  
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(row.description.toString());
  
  await page.getByRole('textbox', { name: 'Cutoff Day' }).click();
  await page.getByRole('textbox', { name: 'Cutoff Day' }).fill(row.cutoffDay.toString());
  
  await page.getByRole('textbox', { name: 'Rank' }).click();
  await page.getByRole('textbox', { name: 'Rank' }).fill(row.rank.toString());
  
  
  await page.getByRole('textbox', { name: 'From Date' }).click();
  await page.getByRole('textbox', { name: 'From Date' }).fill(row.fromDate.toString());
  
  await page.getByRole('textbox', { name: 'To Date' }).click();
  await page.getByRole('textbox', { name: 'To Date' }).fill(row.toDate.toString());
  
  await setInstallment(ctx, row.installments);
  await setTermSet (ctx, row.sets);

  
  await page.getByRole('button', { name: 'Save and Close' }).click();  
  await page.waitForTimeout(300);

  //await page.waitForLoadState("networkidle");
}

module.exports = { run };