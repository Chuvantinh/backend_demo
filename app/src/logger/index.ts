// using https://github.com/mreuvers/typescript-logging

import {
  Category,
  CategoryLogger,
  CategoryServiceFactory,
  CategoryConfiguration,
  LogLevel,
  LoggerType,
  CategoryLogMessage
} from 'typescript-logging';


const defaultConfig = new CategoryConfiguration(LogLevel.Info, LoggerType.Console);
// defaultConfig.formatterLogMessage = (msg: CategoryLogMessage): string => {

// };

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
CategoryServiceFactory.setDefaultConfiguration(defaultConfig);

// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
// log graphql related stuff
export const log = new Category('GQL');
// log Auth related stuff
export const logA = new Category('AUTH');

// log scheduled task related stuff
export const logT = new Category('TSK');

export const logFormat = (payload) => JSON.stringify(payload, null, ' ');
// export const catProd = new Category('product', catService);

// Optionally get a logger for a category, since 0.5.0 this is not necessary anymore, you can use the category itself to log.
  // export const log: CategoryLogger = CategoryServiceFactory.getLogger(cat);