import { ExtendedGluegunToolbox } from '../interfaces/extended-gluegun-toolbox';
/**
 * Welcome to your CLI
 */
module.exports = {
  name: 'check',
  alias: ['c'],
  description: 'Checking node version only',
  hidden: true,
  run: async (toolbox: ExtendedGluegunToolbox) => {
    const {
      strings,
      system,
      print: { info, newline }
    } = toolbox;
    const NODE_VERSION = strings.trim(await system.run('node --version'));
    info(`Node version ${NODE_VERSION}`);
    newline();
  }
};
