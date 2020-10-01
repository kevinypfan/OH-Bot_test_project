import {Entity, hasMany, model, property} from '@loopback/repository';
import {Token} from './token.model';
import {Store} from './store.model';

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

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
