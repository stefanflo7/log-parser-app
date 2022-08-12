import { CommandFactory } from 'nest-commander';
import { LogModule } from './log.module';

async function bootstrap() {
  await CommandFactory.run(LogModule);
}
bootstrap();
