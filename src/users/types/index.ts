import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'Stasik' })
  username: string;

  @ApiProperty({ example: 'stas12341' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: 2,
        username: 'Stasik',
        password: 'stas12341',
      },
    },
  })
  user: {
    userId: number;
    username: string;
    password: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session has ended' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'stasdsa231@gmail.com' })
  email: string;
}

export class SignupResponse {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({
    example: '$2b$10$B9MMMijllOfHRG8EIlrMF.vsLHn77w5mA9iGMQJxVNzLtpTE2ucd',
  })
  password: string;

  @ApiProperty({ example: 'stasdsa231@gmail.com' })
  email: string;

  @ApiProperty({ example: '2023-09-14T23:33:24.612Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-14T23:33:24.612Z' })
  createdAt: string;
}
