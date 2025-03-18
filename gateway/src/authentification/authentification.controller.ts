import { Body, Controller, Get, Inject, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
// import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './authenfitication.service';
import { RegisterDto } from './dtos/registerDto.dto';
import { ResponseFactory } from '../factories/responseFactory';
import { LoginDto } from './dtos/loginDto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  // private oauth2Client: OAuth2Client;

  constructor(
    private readonly authService: AuthService,
    private readonly responseFactory: ResponseFactory,
  ) {
    // this.oauth2Client = new OAuth2Client(
    //   process.env.CLIENT_ID,
    //   process.env.CLIENT_SECRET,
    //   process.env.CLIENT_CALLBACK_URL
    // );
  }


  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration credentials',
    examples: {
      userExample: {
        value: {
          email: 'adriancbalica@gmail.com',
          password: 'passsowrd16441',
          name: 'Adrian Balica'
        }
      }
    }
  })
  public async register(
    @Body() body: RegisterDto,
    @Res() response: Response
  ) {
    try {
      let result = await this.authService.register(body);

      return this.responseFactory.handleResponse(result, response);
    } catch (e) {
      console.log(e);
      return this.responseFactory.handleResponse({ message: e.message, status: e.status, error: e }, response);
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token'
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      userLogin: {
        value: {
          email: 'adriancbalica@gmail.com',
          password: 'parola314351413'
        }
      }
    }
  })
  @Post('login')
  public async login(
    @Body() body: LoginDto,
    @Res() response: Response

  ) {
    try {
      let result = await this.authService.login(body);
      return this.responseFactory.handleResponse(result, response);
    } catch (e) {
      return this.responseFactory.handleResponse({ message: e.message, status: e.status, error: e }, response);
    }
  }

  //google bug

  // @Get('google/login')
  // @UseGuards(GoogleAuthGuard)
  // handleLogin() {
  //   return { msg: 'Google Authentication' };
  // }

  // @Get('google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // googleAuthRedirect(@Req() req, @Query("code") code: string) {
  //   console.log(req.user)
  //   console.log("cde", code);
  //   // try {
  //   //   const { tokens } = await this.oauth2Client.getToken({
  //   //     code: code,
  //   //     client_id: process.env.CLIENT_ID,
  //   //     // client_secret: process.env.CLIENT_SECRET,
  //   //     redirect_uri: 'http://localhost:8080/auth/google/redirect',
  //   //     // grant_type: 'authorization_code'
  //   //     });
  //   //   console.log("tok", tokens)
  //   //   return {
  //   //     access_token: tokens.access_token,
  //   //     id_token: tokens.id_token,
  //   //     refresh_token: tokens.refresh_token
  //   //   };
  //   // } catch (error) {
  //   //   console.error('Error getting tokens:', error);
  //   //   throw error;
  //   // }
  //   // console.log()
  //   return req.user;
  // }
}