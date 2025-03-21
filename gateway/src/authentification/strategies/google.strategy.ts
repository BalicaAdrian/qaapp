// import { Inject, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy } from 'passport-google-oauth20';
// import { AuthService } from 'src/authentification/authenfitication.service';


// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy) {
//     constructor(
//         private readonly authService: AuthService,

//     ) {
//         super({
//             clientID: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             callbackURL: 'http://localhost:8080/auth/google/redirect',
//             scope: ['email', 'profile', 'openid'],
//             accessType: 'offline',
//             prompt: 'consent', 
//             state: true
//         });
//     }

//     async validate(accessToken: string, refreshToken: string, profile: Profile) {
//         const user = await this.authService.validateUser({
//             email: profile.emails[0].value,
//             name: profile.displayName,
//         });
//         return user || null;
//     }
// }