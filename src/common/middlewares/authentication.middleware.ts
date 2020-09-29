import {
  Injectable,
  NestMiddleware,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { customThrowError } from '../helpers/throw.helper';
import { TokenHelper } from '../helpers/token.helper';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenHelper: TokenHelper,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers;
    const tokenString =
      authHeaders.authorization?.split(' ').length > 1
        ? authHeaders.authorization.split(' ')[1]
        : '';

    if (!tokenString) this.handleError();

    const token = await this.tokenHelper.verifyToken(tokenString);

    if (!token) this.handleError();

    next();
  }

  private handleError() {
    customThrowError('Invalid credential', HttpStatus.UNAUTHORIZED);
  }
}
