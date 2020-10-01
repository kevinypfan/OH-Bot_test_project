import {Entity, model, property} from '@loopback/repository';

@model()
export class Store extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_store?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  principal?: string;

  @property({
    type: 'string',
  })
  id_user?: string;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}

export interface StoreRelations {
  // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
