import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsAuthenticated implements CanActivate {
async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();

  if (request.user) {
    return true;
  }
  
  throw new UnauthorizedException('You must be logged in to access this resource');
}
}