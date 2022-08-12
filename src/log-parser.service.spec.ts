import { Test, TestingModule } from '@nestjs/testing';
import { FileReaderService } from './file-reader/file-reader.service';
import { FileWriterService } from './file-writer/file-writer.service';
import { LogParserService } from './log-parser.service';

jest.mock(`fs`, () => ({
  createWriteStream: jest.fn(),
}));

describe('LogParserService', () => {
  let service: LogParserService;

  const mockedFileReaderService: Partial<FileReaderService> = {
    getFile: jest.fn(),
  };

  const mockedFileWriterService: Partial<FileWriterService> = {
    getFile: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        LogParserService,
        {
          provide: FileReaderService,
          useValue: mockedFileReaderService,
        },
        {
          provide: FileWriterService,
          useValue: mockedFileWriterService,
        },
      ],
    }).compile();

    service = testingModule.get<LogParserService>(LogParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTimestamp', () => {
    it('should correctly parse the log line and return the timestamp', async () => {
      const log =
        '2021-08-09T02:12:51.254Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request the user information","userId": 10}';

      expect(await service.getTimestamp(log)).toEqual(
        '2021-08-09T02:12:51.254Z',
      );
    });
  });

  describe('getLogLevel', () => {
    it('should correctly parse the log line and return the log level', async () => {
      const log =
        '2021-08-09T02:12:51.254Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request the user information","userId": 10}';

      expect(await service.getLogLevel(log)).toEqual('debug');
    });
  });

  describe('getLogDetails', () => {
    describe('when the details are correctly JSON formatted', () => {
      it('should correctly parse the log line and return the log details as JSON', async () => {
        const log =
          '2021-08-09T02:12:51.254Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request the user information","userId": 10}';

        expect(await service.getLogDetails(log)).toEqual({
          details: 'About to request the user information',
          transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
          userId: 10,
        });
      });
    });

    describe('when the details are not correctly JSON formatted', () => {
      it('should return empty', async () => {
        const log =
          '2021-08-09T02:12:51.254Z - debug - {"a", "transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request the user information","userId": 10}';

        expect(await service.getLogDetails(log)).toEqual('');
      });
    });
  });
});
