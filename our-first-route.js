async function routes (fastify, options) {
  fastify.get('/test', async (request, reply) => {
    return { hello: 'Srikar' }
  })
}

module.exports = routes