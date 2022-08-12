import { Injectable } from '@nestjs/common';
import * as readline from 'readline';
import 'reflect-metadata';
import { FileReaderService } from './file-reader/file-reader.service';
import { FileWriterService } from './file-writer/file-writer.service';
import { LogStates } from './logStates';
import { formatISODateToUnixTimestamp } from './utils';

interface LogInformation {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err: string;
}

@Injectable()
export class LogParserService {
  constructor(
    private readonly fileReaderService: FileReaderService,
    private readonly fileWriterService: FileWriterService,
  ) {}

  parseLogFile(inputFileName: string, outputFileName: string): void {
    const rl = readline.createInterface({
      input: this.fileReaderService.getFile(inputFileName).getStream(),
    });

    const writerStream = this.fileWriterService.getFile(outputFileName);

    let firstLine = true;

    rl.on('line', (line) => {
      if (this.getLogLevel(line) !== LogStates.ERROR) return;

      const logDetails = this.getLogDetails(line);
      const logTimestamp = this.getTimestamp(line);

      const logResult: LogInformation = {
        timestamp: formatISODateToUnixTimestamp(logTimestamp),
        loglevel: this.getLogLevel(line),
        transactionId: logDetails.transactionId,
        err: logDetails.err,
      };

      if (firstLine) {
        writerStream.write('[' + JSON.stringify(logResult));
      } else {
        writerStream.write(',\n' + JSON.stringify(logResult));
      }

      firstLine = false;
    });

    rl.on('close', () => {
      writerStream.write(']');
    });
  }

  /**
   * Retrieves the timestamp
   */
  getTimestamp(line: string) {
    return line.split(' - ')[0];
  }

  /**
   * Retrieves the log level
   */
  getLogLevel(line: string) {
    return line.split(' - ')[1];
  }

  /**
   * Tries to parse the log details into a JSON.
   * If the details are not on a JSON format then returns empty.
   */
  getLogDetails(line: string) {
    try {
      return JSON.parse(line.split(' - ')[2]);
    } catch (e) {
      return '';
    }
  }
}
