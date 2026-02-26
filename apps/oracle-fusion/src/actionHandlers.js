const coreActions = require("./actions/core.actions");
const fusionNav = require("./actions/fusion/navigation.actions");
const fusionGeneric = require("./actions/fusion/generic.actions");

function buildHandlers() {
  return {
    ...coreActions,
    ...fusionNav,
    ...fusionGeneric,
  };
}

module.exports = { buildHandlers };