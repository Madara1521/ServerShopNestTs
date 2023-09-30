import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import { createHash } from 'crypto';

@Injectable()
export class PaymentService {
  async makePayment(makePaymentDto: MakePaymentDto) {
    try {
      const fondyPassword = 'test';
      const orderBody = {
        currency: 'UAH',
        amount: makePaymentDto.amount,
        merchant_id: 1396424,
        order_desc: 'Test payment',
        order_id: Date.now(),
      };
      const orderedKeys = Object.keys(orderBody).sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      const signatureRaw = orderedKeys.map((v) => orderBody[v]).join('|');
      const signatureSha1 = createHash('sha1');
      signatureSha1.update(`${fondyPassword}|${signatureRaw}`);

      const signature = signatureSha1.digest('hex');

      const { data } = await axios({
        method: 'POST',
        url: 'https://pay.fondy.eu/api/checkout/url/',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now(),
        },
        data: {
          request: {
            ...orderBody,
            signature,
          },
        },
      });

      return data.response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
