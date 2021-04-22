async function routes(fastify, options) {
  // Declare a route
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/test', async (request, reply) => {
    return { hello: 'Srikar' };
  });

  // READ ALL
  fastify.route({
    method: 'GET',
    url: '/testget',
    schema: {
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: function (request, reply) {
      reply.send({ hello: 'testget' });
    },
  });

  // READ ONE
  fastify.route({
    method: 'GET',
    url: '/testgetone/:id',
    schema: {
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: function (request, reply) {
      console.log(request.params);
      reply.send('test get ' + request.params.id);
    },
  });

  // CREATE
  fastify.route({
    method: 'POST',
    url: '/testpost',
    schema: {
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: function (request, reply) {
      console.log(request.body);
      reply.send({ hello: 'testpost' });
    },
  });

  // UPDATE
  fastify.route({
    method: 'PUT',
    url: '/testput',
    schema: {
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: function (request, reply) {
      console.log(request.body);
      reply.send('PUT Request');
    },
  });

  // UPDATE
  fastify.route({
    method: 'DELETE',
    url: '/testdelete',
    schema: {
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: function (request, reply) {
      console.log(request.body);
      reply.send('DELETE Request');
    },
  });
}

module.exports = routes;
