import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import * as base64 from 'base-64';
import { createHash } from 'crypto';

@Injectable()
export class PaymentService {
  async makePayment(makePaymentDto: MakePaymentDto) {
    try {
      const private_key = 'sandbox_HZXySQNLXQxR6c82pfUxIxqQ355y0NtlkrxLJK6u'; // Замените на ваш приватный ключ

      const json_string = {
        public_key: 'sandbox_i79239156752',
        action: 'pay',
        version: 3,
        phone: '380665948101',
        amount: makePaymentDto.amount,
        currency: 'UAH',
        description: 'test',
        order_id: '000001',
      };

      // Формируем json_string
      const data = base64.encode(JSON.stringify(json_string));

      const sha1 = createHash('sha1');
      // Кодируем sign_string функцией sha1 и base64_encode
      sha1.update(private_key + data + private_key);
      const signature = sha1.digest('base64');

      // Формируем POST-запрос к LiqPay API
      const response = await axios.post(
        'https://www.liqpay.ua/api/3/checkout',
        {
          data: data,
          signature: signature,
        },
      );
      const responseData = response.data;

      return responseData;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
