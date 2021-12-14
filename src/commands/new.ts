import { GluegunToolbox } from 'gluegun';
import { GitHandler } from '../handlers/git-handler';
import { FastlaneHandler } from '../handlers/fastlane-handler';
export interface NewCommandRequest {
  name: string;
  typeOfProject: string;
  initializeGitRepo: string;
}
module.exports = {
  name: 'new',
  alias: ['n'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      filesystem,
      // meta,
      system,
      // strings,
      parameters,
      print: { error, success, spin },
      prompt: { ask }
    } = toolbox;
    // const { path } = filesystem;
    // const iomechsPath = path(`${meta.src}`, '../');
    let name = parameters.first;
    const gitHandler = new GitHandler(toolbox);
    const fastlaneHandler = new FastlaneHandler(toolbox);
    if (!name) {
      const result = await ask({
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
    const askTypeOfProject = {
      type: 'list',
      name: 'typeOfProject',
      message: 'What type of project do you want?',
      choices: ['Javascript', 'Typescript']
    };
    const askInitializeGitRepo = {
      type: 'confirm',
      name: 'initializeGitRepo',
      message: 'Do you want to initialize a Git repository?'
    };
    const { typeOfProject, initializeGitRepo } = await ask([askTypeOfProject, askInitializeGitRepo]);
    const request: NewCommandRequest = { name, typeOfProject, initializeGitRepo };
    const spinner = spin('Generating files and installing dependencies');
    if (request.typeOfProject === 'Typescript') {
      await system.run(`npx react-native init ${name} --template react-native-template-typescript`);
    } else {
      await system.run(`npx react-native init ${name}`);
    }
    await gitHandler.handle(request);
    let packageJsonRaw = filesystem.read(`${name}/package.json`);
    packageJsonRaw = packageJsonRaw.replace(/Hello/g, name);
    let packageJson = JSON.parse(packageJsonRaw);
    let packageBoilerRaw = filesystem.read(`packageBoiler.json`);
    packageBoilerRaw = packageBoilerRaw.replace(/Hello/g, name);
    let packageBoiler = JSON.parse(packageBoilerRaw);
    const merge = require('deepmerge-json');
    packageJson = merge(packageJson, packageBoiler);
    filesystem.write(`./${name}/package.json`, packageJson);
    await system.run(`cd ${name} && mkdir fastlane && yarn`);
    await fastlaneHandler.handle(request);
    await system.run(`cd ${name} && mkdir src`);
    await system.run(`cd ${name}/src && mkdir assets navigation modules hooks components constants core store styles`);

    spinner.stop();
    success(`
        Done! Generated new React Native project ${name}.

        Next:
          $ cd ${name}
          $ yarn android
          $ yarn ios
    `);
  }
};
