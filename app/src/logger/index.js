"use strict";
// using https://github.com/mreuvers/typescript-logging
exports.__esModule = true;
exports.logFormat = exports.logT = exports.logA = exports.log = void 0;
var typescript_logging_1 = require("typescript-logging");
var defaultConfig = new typescript_logging_1.CategoryConfiguration(typescript_logging_1.LogLevel.Info, typescript_logging_1.LoggerType.Console);
// defaultConfig.formatterLogMessage = (msg: CategoryLogMessage): string => {
// };
// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
typescript_logging_1.CategoryServiceFactory.setDefaultConfiguration(defaultConfig);
// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
// log graphql related stuff
exports.log = new typescript_logging_1.Category('GQL');
// log Auth related stuff
exports.logA = new typescript_logging_1.Category('AUTH');
// log scheduled task related stuff
exports.logT = new typescript_logging_1.Category('TSK');
exports.logFormat = function (payload) { return JSON.stringify(payload, null, ' '); };
// export const catProd = new Category('product', catService);
// Optionally get a logger for a category, since 0.5.0 this is not necessary anymore, you can use the category itself to log.
// export const log: CategoryLogger = CategoryServiceFactory.getLogger(cat);
