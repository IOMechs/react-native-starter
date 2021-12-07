// import { GluegunToolbox } from "../types"
import { GluegunToolbox } from 'gluegun';
// const path = require('path')
module.exports = {
  name: 'new',
  alias: ['n'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      filesystem,
      meta,
      system,
      strings,
      parameters,
      print: { error, info, success, spin, newline },
      prompt
    } = toolbox;
    const { path } = filesystem;
    const iomechsPath = path(`${meta.src}`, '../');
    console.log('IGNITE', iomechsPath);
    let name = parameters.first;
    if (!name) {
      const result = await prompt.ask({
        type: 'input',
        name: 'name',
        message: 'Your Project Name'
      });
      if (result && result.name) name = result.name;
    }
    if (!name) {
      error('No project name specified!');
      return;
    }
    const node_version = strings.trim(await system.run('node --version'));
    info(`Node version ${node_version}`);
    newline();
    const spinner = spin('Generating files and installing dependencies');
    await system.run(`npx react-native init ${name} --template react-native-template-typescript`);
    spinner.stop();
    success(`
        Done! Generated new React Native TypeScript project ${name}.

        Next:
          $ cd ${name}
          $ yarn android
          $ yarn ios
    `);
  }
};
