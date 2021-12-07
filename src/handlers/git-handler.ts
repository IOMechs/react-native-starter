import { GluegunToolbox } from 'gluegun';
import { NewCommandRequest } from '../commands/new';

export class GitHandler {
  constructor(private toolbox: GluegunToolbox) {}

  public async handle(request: NewCommandRequest) {
    if (request.initializeGitRepo) {
      const name = request.name;
      await this.toolbox.system.run(`cd ${name} && git init && git add . && git commit -m "initial commit"`);
    }
  }
}
