import { GluegunToolbox } from 'gluegun';
import { NewCommandRequest } from '../commands/new';

export class FastlaneHandler {
  constructor(private toolbox: GluegunToolbox) {}

  public async handle(request: NewCommandRequest) {
    if (request.typeOfProject === 'Javascript') {
      const name = request.name;

      await this.toolbox.template.generate({
        template: 'fastlane/Gemfile',
        target: `${name}/Gemfile`,
        props: { name }
      });
      await this.toolbox.template.generate({
        template: 'fastlane/Fastfile',
        target: `${name}/fastlane/Fastfile`,
        props: { name }
      });

      await this.toolbox.template.generate({
        template: 'fastlane/Pluginfile',
        target: `${name}/fastlane/Pluginfile`,
        props: { name }
      });

      await this.toolbox.template.generate({
        template: 'fastlane/README.md',
        target: `${name}/fastlane/README.md`,
        props: { name }
      });

      await this.toolbox.template.generate({
        template: 'fastlane/report.xml',
        target: `${name}/fastlane/report.xml`,
        props: { name }
      });
    }
  }
}
