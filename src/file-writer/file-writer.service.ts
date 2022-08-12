import { Injectable } from '@nestjs/common';
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FileWriterService {
  getFile(fileName: string): WriteStream {
    return createWriteStream(join(process.cwd(), fileName));
  }
}
