import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE } from '../constants/token-types.enum';

@Injectable()
export class TokenHelper {
  secret = '';
  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get('TOKEN_SECRET');
  }

  createToken(data: Record<string, unknown>): any {
    try {
      const token = jwt.sign(
        { ...data, iat: Math.floor(Date.now() / 1000) },
        this.secret,
      );
      return token;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: 'Invalid credential' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  verifyToken(token: string, type: string = TOKEN_TYPE.LOGIN): any {
    try {
      const data: any = jwt.verify(token, this.secret);
      if (data.type === type) return data;
      throw new HttpException(
        { message: 'Invalid Credential' },
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw new HttpException(
        { message: 'Invalid credential' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
