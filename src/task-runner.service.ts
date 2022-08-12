import { Command, CommandRunner } from 'nest-commander';
import 'reflect-metadata';
import { LogParserService } from './log-parser.service';

@Command({
  name: 'run',
  arguments: '<inputFileName> <outputFileName>',
  options: { isDefault: true },
})
export class TaskRunner extends CommandRunner {
  constructor(private readonly logParserService: LogParserService) {
    super();
  }

  async run(inputs: string[]): Promise<void> {
    const inputFileName = inputs[0];
    const outputFileName = inputs[1];

    this.logParserService.parseLogFile(inputFileName, outputFileName);
  }
}
