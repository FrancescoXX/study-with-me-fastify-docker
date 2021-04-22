// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

fastify.register(require('./routes'));

// Run the server!
const start = () => {
  fastify.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};
start();
