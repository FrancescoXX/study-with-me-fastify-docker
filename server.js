// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

console.log(process.env);

fastify.register(require('./routes'));
fastify.register(require('fastify-postgres'), {
  // connection string
  // postgres://user:pass@localhost:35432/db
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});

// await client.connect();
/**
 * Create a new Table if it not exists
 */
// try {
//   await client.connect();
//   await client.query('CREATE TABLE IF NOT EXISTS "products" ("id" SERIAL PRIMARY KEY,"name" varchar(30),"description" varchar(30),"price" integer);');
// } catch (error) {
//   console.error("CAN'T CONNECT TO DB!");
// } finally {
//   // await client.end();
// }

// init db
fastify.get('/initDB', (req, reply) => {
  fastify.pg.connect(onConnect);

  function onConnect(err, client, release) {
    if (err) return reply.send(err);

    client.query(
      'CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY,"name" varchar(30),"description" varchar(30),"tweets" integer);',
      function onResult(err, result) {
        release();
        reply.send(err || result);
      }
    );
  }
});

//GET all users
fastify.route({
  method: 'GET',
  url: '/users',
  schema: {
    querystring: {
      name: { type: 'string' },
      excitement: { type: 'integer' },
    },
    // response: {
    //   200: {
    //     type: 'object',
    //   },
    // },
  },
  handler: async function (request, reply) {
    fastify.pg.connect(onConnect);

    function onConnect(err, client, release) {
      if (err) return reply.send(err);

      // client.query('SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id], function onResult(err, result) {
      client.query('SELECT * from users', function onResult(err, result) {
        console.log(result.rows);
        release();
        reply.send(err || result.rows);
      });
    }
  },
});

//Create users
fastify.route({
  method: 'POST',
  url: '/users',
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
    fastify.pg.connect(onConnect);

    function onConnect(err, client, release) {
      if (err) return reply.send(err);

      const newUser = request.body;
      console.log('adding', newUser);
      // client.query('SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id], function onResult(err, result) {
      client.query(
        `INSERT into users (id,name,description,tweets) VALUES(${newUser.id},'${newUser.name}','${newUser.description}',${newUser.tweets})`,
        function onResult(err, result) {
          release();
          reply.send(err || result);
        }
      );
    }

    // reply.send();
  },
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
