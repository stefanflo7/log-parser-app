import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { FileReaderService } from './file-reader.service';

jest.mock(`fs`, () => ({
  createReadStream: jest.fn(),
}));

describe('FileReaderService', () => {
  let service: FileReaderService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [FileReaderService],
    }).compile();

    service = testingModule.get<FileReaderService>(FileReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFile', () => {
    const mockedReadStream = new Readable();
    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockedReadStream as any);

    it('calls createReadStream with the right params', async () => {
      await service.getFile('fileName');

      expect(fs.createReadStream).toHaveBeenCalledWith(
        join(process.cwd(), 'fileName'),
      );
    });
  });
});
