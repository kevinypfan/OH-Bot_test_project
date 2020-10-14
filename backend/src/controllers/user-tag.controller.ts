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
UserTagRelation,
Tag,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTagController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of User has many Tag through UserTagRelation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.userRepository.tags(id).find(filter);
  }

  @post('/users/{id}/tags', {
    responses: {
      '200': {
        description: 'create a Tag model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tag)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id_user,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {
            title: 'NewTagInUser',
            exclude: ['id_tag'],
          }),
        },
      },
    }) tag: Omit<Tag, 'id_tag'>,
  ): Promise<Tag> {
    return this.userRepository.tags(id).create(tag);
  }

  @patch('/users/{id}/tags', {
    responses: {
      '200': {
        description: 'User.Tag PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {partial: true}),
        },
      },
    })
    tag: Partial<Tag>,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.userRepository.tags(id).patch(tag, where);
  }

  @del('/users/{id}/tags', {
    responses: {
      '200': {
        description: 'User.Tag DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.userRepository.tags(id).delete(where);
  }
}
