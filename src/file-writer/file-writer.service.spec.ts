import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import { Writable } from 'stream';
import { FileWriterService } from './file-writer.service';

jest.mock(`fs`, () => ({
  createWriteStream: jest.fn(),
}));

describe('FileWriterService', () => {
  let service: FileWriterService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [FileWriterService],
    }).compile();

    service = testingModule.get<FileWriterService>(FileWriterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFile', () => {
    const mockedWriteStream = new Writable();
    jest
      .spyOn(fs, 'createWriteStream')
      .mockReturnValue(mockedWriteStream as any);

    it('calls createWriteStream with the right params', async () => {
      expect(await service.getFile('fileName')).toEqual(mockedWriteStream);

      expect(fs.createWriteStream).toHaveBeenCalledWith(
        join(process.cwd(), 'fileName'),
      );
    });
  });
});
