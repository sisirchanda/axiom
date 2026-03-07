const path = require("path");
const { parsePaymentTermsWorkbook } = require("../parsers/payables/paymentTerms.parser.new");

function main() {
  const filePath = path.join(__dirname, "..", "..", "testdata", "payables", "payment_terms.xlsx");

  const terms = parsePaymentTermsWorkbook(filePath,'PaymentTerms');

  console.log("Parsed term count:", terms.length);
  console.log(JSON.stringify(terms, null, 2));
}

main();