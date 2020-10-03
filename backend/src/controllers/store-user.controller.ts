import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Store,
  User,
} from '../models';
import {StoreRepository} from '../repositories';

export class StoreUserController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) { }

  @get('/stores/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Store',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Store.prototype.id_store,
  ): Promise<User> {
    return this.storeRepository.user(id);
  }
}
