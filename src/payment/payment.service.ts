import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import * as base64 from 'base-64';
import sha1 from 'sha1';

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
        currency: 'USD',
        description: 'test',
        order_id: '000001',
        card: '4000000000003055',
        card_exp_month: '03',
        card_exp_year: '22',
        card_cvv: '111',
      };

      // Формируем json_string
      const data = base64.encode(JSON.stringify(json_string));

      // Кодируем sign_string функцией sha1 и base64_encode
      const signature = base64.encode(sha1(private_key + data + private_key));

      // Формируем POST-запрос к LiqPay API
      const response = await axios.post('https://www.liqpay.ua/api/request', {
        data,
        signature,
      });

      return response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
