import { HttpStatus, HttpException } from '@nestjs/common';

export const customThrowError = (
  message: string,
  code: HttpStatus,
  error?: Error,
): void => {
  throw new HttpException({ message, error }, code);
};
