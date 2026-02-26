const path = require("path");

const map = {
  "payables::payment terms": path.join(__dirname, "..", "flows", "payables.payment-terms.json"),
};

function getFlowPath(moduleName, submoduleName) {
  const key = `${moduleName}::${submoduleName}`.toLowerCase();
  return map[key] || null;
}

module.exports = { getFlowPath };