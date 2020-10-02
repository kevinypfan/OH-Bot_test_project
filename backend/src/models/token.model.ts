import {Entity, model, property} from '@loopback/repository';

@model()
export class Token extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_token?: string;

  @property({
    type: 'string',
  })
  access_token?: string;

  @property({
    type: 'string',
  })
  refresh_token?: string;

  @property({
    type: 'string',
  })
  auth_token?: string;

  @property({
    type: 'date',
  })
  expires?: string;

  @property({
    type: 'string',
  })
  id_user?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  revoked?: boolean;

  constructor(data?: Partial<Token>) {
    super(data);
  }
}

export interface TokenRelations {
  // describe navigational properties here
}

export type TokenWithRelations = Token & TokenRelations;
