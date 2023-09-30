import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from '../../src/payment/payment.service';

describe('Payment Service', () => {
  let app: INestApplication;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        PaymentModule,
      ],
    }).compile();

    paymentService = testModule.get<PaymentService>(PaymentService);

    app = testModule.createNestApplication();

    await app.init();
  });

  it('should make payment', async () => {
    const data = await paymentService.makePayment({ amount: 10000 });

    expect(data).toEqual(
      expect.objectContaining({
        checkout_url: expect.any(String),
        payment_id: expect.any(String),
        response_status: expect.any(String),
      }),
    );
  });
});
