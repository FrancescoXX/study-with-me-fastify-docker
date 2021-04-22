async function routes(fastify, options) {
  
  // Declare a route
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/test', async (request, reply) => {
    return { hello: 'Srikar' };
  });

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
}

module.exports = routes;
