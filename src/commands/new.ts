import { GluegunToolbox } from 'gluegun';
import { GitHandler } from '../handlers/git-handler';
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
      meta,
      system,
      strings,
      parameters,
      print: { error, info, success, spin, newline },
      prompt: { ask }
    } = toolbox;
    const { path } = filesystem;
    const iomechsPath = path(`${meta.src}`, '../');
    console.log(iomechsPath);
    let name = parameters.first;
    const gitHandler = new GitHandler(toolbox);
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
    const node_version = strings.trim(await system.run('node --version'));
    info(`Node version ${node_version}`);
    newline();
    const spinner = spin('Generating files and installing dependencies');
    // system.run(`mkdir ${name}`)
    // system.run(`touch ${name}/file.ts`)
    if (request.typeOfProject == 'Typescript') {
      await system.run(`npx react-native init ${name} --template react-native-template-typescript`);
    } else {
      await system.run(`npx react-native init ${name}`);
    }
    await gitHandler.handle(request);
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
