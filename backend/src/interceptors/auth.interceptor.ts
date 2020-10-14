import {
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, RestBindings} from '@loopback/rest';
import moment from 'moment';
import {TokenRepository, UserRepository} from '../repositories/index';

const PUBLIC_END_POINTS = [
  {path: '/stores', methods: 'GET'},
  {path: '/auth', methods: 'GET'},
  {path: '/oauth-urls', methods: 'GET'},
  {path: '/users/{?}/tags', methods: 'POST'},
  // {path: '/users', methods: 'GET,POST'},
  // {path: '/stores/{?}', methods: 'GET'},
];
const USER_END_POINTS = [
  {path: '/users', methods: 'GET,POST'},
  {path: '/stores', methods: 'POST'},
  {path: '/stores/{?}', methods: 'PATCH'},
  {path: '/profile', methods: 'GET'},
  {path: '/logout', methods: 'DELETE'},
  {path: '/stores/{?}', methods: 'DELETE'},
];

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('middleware', {tags: {name: 'Auth'}})
export class AuthInterceptor implements Provider<Interceptor> {
  constructor(
    @repository(TokenRepository) public tokenRepository: TokenRepository,
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      const req: any = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });

      if (req) {
        const matchUserEndPointIndex = USER_END_POINTS.findIndex(endPoint => {
          // return (
          //   endPoint.path === req.url &&
          //   endPoint.methods.indexOf(req.method.toUpperCase()) > -1
          // );
          if (endPoint.methods.indexOf(req.method.toUpperCase()) > -1) {
            const checkPath = req.path.split('/');
            const testPath = endPoint.path.split('/');
            if (checkPath.length === testPath.length) {
              const match = testPath.map((path, index) => {
                if (path === '{?}') return true;
                if (path === checkPath[index]) return true;
                return false;
              });
              console.log(match);
              return match.every(el => el);
            }
          }
          return false;
        });
        if (matchUserEndPointIndex > -1) {
          const auth_token = req.header('auth_token');
          if (!auth_token) {
            throw new HttpErrors[422]('Required header not found');
          }
          const token = await this.tokenRepository.findOne({
            where: {auth_token},
          });
          if (!token || token.revoked) {
            throw new HttpErrors[401]('Invalid session token');
          }
          if (moment(token.expires).isBefore(moment())) {
            throw new HttpErrors[401]('Session token Expired');
          }
          req.token = token;
          const user = await this.userRepository.findById(token.id_user);
          req.user = user;
          const result = await next();
          return result;
        }

        const matchPublicEndPointIndex = PUBLIC_END_POINTS.findIndex(
          endPoint => {
            // return (
            //   endPoint.path === req.url &&
            //   endPoint.methods.indexOf(req.method.toUpperCase()) > -1
            // );
            if (endPoint.methods.indexOf(req.method.toUpperCase()) > -1) {
              const checkPath = req.path.split('/');
              const testPath = endPoint.path.split('/');
              if (checkPath.length === testPath.length) {
                const match = testPath.map((path, index) => {
                  if (path === '{?}') return true;
                  if (path === checkPath[index]) return true;
                  return false;
                });
                return match.every(el => el);
              }
            }
            return false;
          },
        );
        if (matchPublicEndPointIndex > -1) {
          const result = await next();
          return result;
        }
      }

      throw new HttpErrors.NotFound('Request path not allow or not found!');
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
