const path = require("path");

function loadModuleConfig(moduleName) {

  const configPath = path.join(
    __dirname,
    "..",
    "config",
    `${moduleName}.config.json`
  );

  const config = require(configPath);

  if (!config.tasks) {
    throw new Error(`No tasks defined for module ${moduleName}`);
  }

  return config.tasks;
}

function resolveTasks(moduleName) {

  const tasks = loadModuleConfig(moduleName);

  return Object.entries(tasks).map(([taskKey, task]) => {

    return {
      taskKey,
      sheet: task.sheet,
      fusionTask: task.fusionTask,
	  parserPath: path.join(
        __dirname,
        "parsers",
        moduleName,
        task.parser		
	  ),
      handlerPath: path.join(
        __dirname,
        "handlers",
        moduleName,
        task.handler
      )
    };

  });
}

module.exports = { resolveTasks };