import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  async makePayment(makePaymentDto: MakePaymentDto) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://www.liqpay.ua/api/3/checkout',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now(),
        },
        data: {
          action: 'p2pcredit',
          version: 3,
          public_key: 'sandbox_i79239156752',
          amount: makePaymentDto.amount,
          currency: 'UAH',
          description: 'Заказ 1',
          ip: '123.11.2223.113',
          order_id: Date.now(),
          language: 'ua',
          server_url: 'http://localhost:3000',
          taxed: 'Дякуемо за покупку',
        },
      });
      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
