// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

console.log(process.env);

fastify.register(require('./routes'));
fastify.register(require('fastify-postgres'), {
  // connection string
  // postgres://user:pass@localhost:35432/db
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});

fastify.get('/user/:id', (req, reply) => {
  console.log('testing db');
  fastify.pg.connect(onConnect);

  function onConnect(err, client, release) {
    if (err) return reply.send(err);

    client.query('SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id], function onResult(err, result) {
      release();
      reply.send(err || result);
    });
  }
});

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
