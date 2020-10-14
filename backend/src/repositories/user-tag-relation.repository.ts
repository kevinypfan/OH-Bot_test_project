import {DefaultCrudRepository} from '@loopback/repository';
import {UserTagRelation, UserTagRelationRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserTagRelationRepository extends DefaultCrudRepository<
  UserTagRelation,
  typeof UserTagRelation.prototype.id_user_tag_relation,
  UserTagRelationRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(UserTagRelation, dataSource);
  }
}
