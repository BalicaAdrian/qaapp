import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, HttpException } from '@nestjs/common';
import { RpcException, BaseRpcExceptionFilter } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
catch(exception: any, host: ArgumentsHost) {
  const ctx = host.switchToRpc();

  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errorName = 'InternalServerError';

  console.log(exception)
  if (exception instanceof RpcException) {
    const rpcError = exception.getError() as { message: string; status: number };
    message = rpcError.message;
    status = rpcError.status;
  } else if (exception instanceof HttpException) {
    status = exception.getStatus();
    message = exception.message;
    errorName = exception.name;
  } else if (exception instanceof Error) {
    message = exception.message;
  }

  return {
    status: status,
    message: message,
    error: errorName,
  };
}
}