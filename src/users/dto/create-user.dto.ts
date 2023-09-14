import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Stasik' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'stas12341' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'stasdsa231@gmail.com' })
  @IsNotEmpty()
  readonly email: string;
}
