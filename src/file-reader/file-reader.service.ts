import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FileReaderService {
  getFile(fileName: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), fileName));

    return new StreamableFile(file);
  }
}
