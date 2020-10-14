import {Entity, hasMany, model, property} from '@loopback/repository';
import {Store} from './store.model';
import {Tag} from './tag.model';
import {Token} from './token.model';
import {UserTagRelation} from './user-tag-relation.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_user?: string;

  @property({
    type: 'string',
  })
  picture?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @hasMany(() => Token, {keyTo: 'id_user'})
  tokens: Token[];

  @hasMany(() => Store, {keyTo: 'id_user'})
  stores: Store[];

  @hasMany(() => Tag, {
    through: {
      model: () => UserTagRelation,
      keyFrom: 'id_user',
      keyTo: 'id_tag',
    },
  })
  tags: Tag[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
