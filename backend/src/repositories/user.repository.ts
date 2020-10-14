import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {
  Store,
  Tag,
  Token,
  User,
  UserRelations,
  UserTagRelation,
} from '../models';
import {StoreRepository} from './store.repository';
import {TagRepository} from './tag.repository';
import {TokenRepository} from './token.repository';
import {UserTagRelationRepository} from './user-tag-relation.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id_user,
  UserRelations
> {
  public readonly tokens: HasManyRepositoryFactory<
    Token,
    typeof User.prototype.id_user
  >;

  public readonly stores: HasManyRepositoryFactory<
    Store,
    typeof User.prototype.id_user
  >;

  public readonly tags: HasManyThroughRepositoryFactory<
    Tag,
    typeof Tag.prototype.id_tag,
    UserTagRelation,
    typeof User.prototype.id_user
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('TokenRepository')
    protected tokenRepositoryGetter: Getter<TokenRepository>,
    @repository.getter('StoreRepository')
    protected storeRepositoryGetter: Getter<StoreRepository>,
    @repository.getter('UserTagRelationRepository')
    protected userTagRelationRepositoryGetter: Getter<
      UserTagRelationRepository
    >,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,
  ) {
    super(User, dataSource);
    this.tags = this.createHasManyThroughRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
      userTagRelationRepositoryGetter,
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
    this.stores = this.createHasManyRepositoryFactoryFor(
      'stores',
      storeRepositoryGetter,
    );
    this.registerInclusionResolver('stores', this.stores.inclusionResolver);
    this.tokens = this.createHasManyRepositoryFactoryFor(
      'tokens',
      tokenRepositoryGetter,
    );
    this.registerInclusionResolver('tokens', this.tokens.inclusionResolver);
  }
}
