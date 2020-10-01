import {DefaultCrudRepository} from '@loopback/repository';
import {Token, TokenRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TokenRepository extends DefaultCrudRepository<
  Token,
  typeof Token.prototype.id_token,
  TokenRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Token, dataSource);
  }
}
