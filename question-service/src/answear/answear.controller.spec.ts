import { Test, TestingModule } from '@nestjs/testing';
import { AnswearController } from './answear.controller';

describe('AnswearController', () => {
  let controller: AnswearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswearController],
    }).compile();

    controller = module.get<AnswearController>(AnswearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
