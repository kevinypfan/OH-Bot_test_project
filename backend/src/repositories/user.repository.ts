import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Token, Store} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TokenRepository} from './token.repository';
import {StoreRepository} from './store.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id_user,
  UserRelations
> {

  public readonly tokens: HasManyRepositoryFactory<Token, typeof User.prototype.id_user>;

  public readonly stores: HasManyRepositoryFactory<Store, typeof User.prototype.id_user>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('TokenRepository') protected tokenRepositoryGetter: Getter<TokenRepository>, @repository.getter('StoreRepository') protected storeRepositoryGetter: Getter<StoreRepository>,
  ) {
    super(User, dataSource);
    this.stores = this.createHasManyRepositoryFactoryFor('stores', storeRepositoryGetter,);
    this.registerInclusionResolver('stores', this.stores.inclusionResolver);
    this.tokens = this.createHasManyRepositoryFactoryFor('tokens', tokenRepositoryGetter,);
    this.registerInclusionResolver('tokens', this.tokens.inclusionResolver);
  }
}
