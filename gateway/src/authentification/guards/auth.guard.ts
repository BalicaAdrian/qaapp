// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// // import { OAuth2Client } from 'google-auth-library';

// @Injectable()
// export class GoogleTokenGuard implements CanActivate {
//   private oauth2Client: OAuth2Client;

//   constructor() {
//     this.oauth2Client = new OAuth2Client(
//       process.env.CLIENT_ID
//     );
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const [_, token] = request.headers.authorization?.split(' ')

//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }

//     try {
//       const ticket = await this.oauth2Client.verifyIdToken({
//         idToken: token,
//         audience: process.env.CLIENT_ID
//       });
//       const payload = ticket.getPayload();
//       console.log(payload)
//       request.user = payload;

//       return true;
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }