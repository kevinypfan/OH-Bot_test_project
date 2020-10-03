import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Store, StoreRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id_store,
  StoreRelations
> {
  public readonly createdBy: HasOneRepositoryFactory<
    User,
    typeof Store.prototype.id_store
  >;

  public readonly user: BelongsToAccessor<User, typeof Store.prototype.id_store>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Store, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
