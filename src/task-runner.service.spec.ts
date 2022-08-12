import { Test, TestingModule } from '@nestjs/testing';
import { LogParserService } from './log-parser.service';
import { TaskRunner } from './task-runner.service';

jest.mock(`fs`, () => ({
  createWriteStream: jest.fn(),
}));

describe('TaskRunner', () => {
  let service: TaskRunner;

  const mockedLogParserService: Partial<LogParserService> = {
    parseLogFile: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRunner,
        {
          provide: LogParserService,
          useValue: mockedLogParserService,
        },
      ],
    }).compile();

    service = testingModule.get<TaskRunner>(TaskRunner);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    let parseLogFileSpy: jest.SpyInstance;

    beforeEach(() => {
      parseLogFileSpy = jest.spyOn(mockedLogParserService, 'parseLogFile');
    });

    it('calls LogParserService method with the right params', async () => {
      await service.run(['inputFileName', 'outputFileName']);

      expect(parseLogFileSpy).toHaveBeenCalledTimes(1);
      expect(parseLogFileSpy).toHaveBeenCalledWith(
        'inputFileName',
        'outputFileName',
      );
    });
  });
});
