import { Module } from '@nestjs/common';
import { FileReaderModule } from './file-reader/file-reader.module';
import { FileWriterModule } from './file-writer/file-writer.module';
import { LogParserService } from './log-parser.service';
import { TaskRunner } from './task-runner.service';

@Module({
  imports: [FileReaderModule, FileWriterModule],
  providers: [LogParserService, TaskRunner],
  exports: [LogParserService],
})
export class LogModule {}
