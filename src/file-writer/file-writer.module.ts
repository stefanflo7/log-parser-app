import { Module } from '@nestjs/common';
import { FileWriterService } from './file-writer.service';

@Module({
  providers: [FileWriterService],
  exports: [FileWriterService],
})
export class FileWriterModule {}
