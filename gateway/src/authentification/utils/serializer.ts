// import { Inject, Injectable } from '@nestjs/common';
// import { PassportSerializer } from '@nestjs/passport';
// import { AuthService } from 'src/authentification/authenfitication.service';

// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//   constructor(
//     private readonly authService: AuthService,
//   ) {
//     super();
//   }

//   serializeUser(user: any, done: Function) {
//     done(null, user);
//   }

//   async deserializeUser(payload: any, done: Function) {
//     const user = await this.authService.getUserById(payload.id);
//     return user ? done(null, user) : done(null, null);
//   }
// }