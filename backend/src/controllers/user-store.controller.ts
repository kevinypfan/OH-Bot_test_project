import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Store,
} from '../models';
import {UserRepository} from '../repositories';

export class UserStoreController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'Array of User has many Store',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Store)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Store>,
  ): Promise<Store[]> {
    return this.userRepository.stores(id).find(filter);
  }

  @post('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id_user,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            title: 'NewStoreInUser',
            exclude: ['id_store'],
            optional: ['id_user']
          }),
        },
      },
    }) store: Omit<Store, 'id_store'>,
  ): Promise<Store> {
    return this.userRepository.stores(id).create(store);
  }

  @patch('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'User.Store PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Partial<Store>,
    @param.query.object('where', getWhereSchemaFor(Store)) where?: Where<Store>,
  ): Promise<Count> {
    return this.userRepository.stores(id).patch(store, where);
  }

  @del('/users/{id}/stores', {
    responses: {
      '200': {
        description: 'User.Store DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Store)) where?: Where<Store>,
  ): Promise<Count> {
    return this.userRepository.stores(id).delete(where);
  }
}
