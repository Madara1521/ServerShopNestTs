import { ApiProperty } from '@nestjs/swagger';

export class MakePaymentResponse {
  @ApiProperty({
    example:
      'https://pay.fondy.eu/merchants/5ad6b888f4becb0c33d543d54e57d86c/default/index.html?token=f5653170b3585c977668fd36805f1882cc46db93',
  })
  checkout_url: string;

  @ApiProperty({ example: '658496768' })
  payment_id: string;

  @ApiProperty({ example: 'success' })
  response_status: string;
}
