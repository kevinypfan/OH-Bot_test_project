import {Entity, model, property} from '@loopback/repository';

@model()
export class UserTagRelation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_user_tag_relation?: string;

  @property({
    type: 'string',
    required: true,
  })
  id_tag: string;

  @property({
    type: 'string',
    required: true,
  })
  id_user: string;


  constructor(data?: Partial<UserTagRelation>) {
    super(data);
  }
}

export interface UserTagRelationRelations {
  // describe navigational properties here
}

export type UserTagRelationWithRelations = UserTagRelation & UserTagRelationRelations;
