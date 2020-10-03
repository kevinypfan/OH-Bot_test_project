import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {Store} from '../models';
import {StoreRepository} from '../repositories';

export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) {}

  @post('/stores', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  async create(
    @inject(RestBindings.Http.REQUEST) request: any,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            title: 'NewStore',
            exclude: ['id_store'],
          }),
        },
      },
    })
    store: Omit<Store, 'id_store'>,
  ): Promise<Store> {
    store.id_user = request.user.id_user;
    return this.storeRepository.create(store);
  }

  @get('/stores/count', {
    responses: {
      '200': {
        description: 'Store model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Store) where?: Where<Store>): Promise<Count> {
    return this.storeRepository.count(where);
  }

  @get('/stores', {
    responses: {
      '200': {
        description: 'Array of Store model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Store, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    return this.storeRepository.find(filter);
  }

  @patch('/stores', {
    responses: {
      '200': {
        description: 'Store PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
    @param.where(Store) where?: Where<Store>,
  ): Promise<Count> {
    return this.storeRepository.updateAll(store, where);
  }

  @get('/stores/{id}', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Store, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Store, {exclude: 'where'})
    filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }

  @patch('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PATCH success',
      },
    },
  })
  async updateById(
    @inject(RestBindings.Http.REQUEST) request: any,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
  ): Promise<void> {
    const oldStore = await this.storeRepository.findById(id);
    if (oldStore.id_user.toString() !== request.user.id_user.toString()) {
      throw new HttpErrors[403]('Your are not the creator');
    }
    await this.storeRepository.updateById(id, store);
  }

  @put('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() store: Store,
  ): Promise<void> {
    await this.storeRepository.replaceById(id, store);
  }

  @del('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store DELETE success',
      },
    },
  })
  async deleteById(
    @inject(RestBindings.Http.REQUEST) request: any,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const store = await this.storeRepository.findById(id);
    if (store.id_user.toString() !== request.user.id_user.toString()) {
      throw new HttpErrors[403]('Your are not the creator');
    }
    await this.storeRepository.deleteById(id);
  }
}
