// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, get, param, Response, RestBindings} from '@loopback/rest';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {Token, User} from '../models';
import {TokenRepository, UserRepository} from '../repositories';
import {generateRandomToken} from '../utils/genToken';

interface PROFILE {
  id_user: string;
  name: string;
  picture: string;
  email: string;
}

export class AuthController {
  constructor(
    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @get('/oauth-urls')
  async oauthUrls(): Promise<object> {
    const baseLineOauthUrl = 'https://access.line.me/oauth2/v2.1/authorize';
    const data = new URLSearchParams();
    data.append('response_type', 'code');
    data.append('client_id', process.env.LINE_CLIENT_ID!);
    data.append('redirect_uri', process.env.LINE_REDIRECT_URI!);
    data.append('state', '12345abcde');
    data.append('scope', 'openid%20profile%20email');
    data.append('nonce', '09876xyz');

    return {
      line: baseLineOauthUrl + data.toString(),
    };
  }

  @get('/auth')
  async auth(
    @param.query.string('code') code: string,
    @param.query.string('state') state: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const data = new URLSearchParams();
    // LINE_CLIENT_ID
    // LINE_CLIENT_SECRET
    // LINE_REDIRECT_URI
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', process.env.LINE_REDIRECT_URI!);
    data.append('code', code);
    data.append('client_id', process.env.LINE_CLIENT_ID!);
    data.append('client_secret', process.env.LINE_CLIENT_SECRET!);

    const result = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      data.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const decode: any = jwt.verify(
      result.data.id_token,
      process.env.LINE_CLIENT_SECRET!,
    );

    let user: User;
    const oldUser = await this.userRepository.findOne({
      where: {email: decode.email},
    });
    if (!oldUser) {
      const newUser = new User();
      newUser.email = decode.email;
      newUser.name = decode.name;
      newUser.picture = decode.picture;
      user = await this.userRepository.create(newUser);
    } else {
      user = oldUser;
    }

    const tokenBeSave = new Token();
    tokenBeSave.access_token = result.data.access_token;
    tokenBeSave.refresh_token = result.data.refresh_token;
    tokenBeSave.expires = new Date(
      new Date().valueOf() + result.data.expires_in * 1000,
    ).toISOString();
    tokenBeSave.id_user = user.id_user;
    tokenBeSave.auth_token = user.id_user + (await generateRandomToken());
    const token = await this.tokenRepository.create(tokenBeSave);

    response.redirect(
      301,
      `${process.env.FRONTEND_URL}/process-login?token=${token.auth_token}&state=${state}`,
    );
  }

  @get('/profile')
  async profile(
    @inject(RestBindings.Http.REQUEST) request: any,
  ): Promise<PROFILE> {
    return {
      id_user: request.user.id_user.toString(),
      name: request.user.name,
      email: request.user.email,
      picture: request.user.picture,
    };
  }

  @del('/logout')
  async logout(@inject(RestBindings.Http.REQUEST) request: any): Promise<void> {
    console.log(request.token);
    const token = await this.tokenRepository.findById(request.token.id_token);
    token.revoked = true;
    this.tokenRepository.update(token);
  }
}
