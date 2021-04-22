const fastify = require('fastify')({ logger: true });
fastify.register(require('./routes'));
fastify.register(require('fastify-postgres'), {
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});

// init db. Launch just once to create the table
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
  handler: async function (request, reply) {
    fastify.pg.connect(onConnect);
    function onConnect(err, client, release) {
      if (err) return reply.send(err);
      client.query('SELECT * from users', function onResult(err, result) {
        console.log(result.rows);
        release();
        reply.send(err || result.rows);
      });
    }
  },
});

//GET ONE USER if exists
fastify.route({
  method: 'GET',
  url: '/users/:id',
  handler: async function (request, reply) {
    fastify.pg.connect(onConnect);
    function onConnect(err, client, release) {
      if (err) return reply.send(err);
      client.query(`SELECT * from users where id=${request.params.id}`, function onResult(err, result) {
        console.log(result.rows[0]);
        release();
        reply.send(err || result.rows[0]);
      });
    }
  },
});

//DELETE ONE USER if exists
fastify.route({
  method: 'DELETE',
  url: '/users/:id',
  handler: async function (request, reply) {
    fastify.pg.connect(onConnect);
    function onConnect(err, client, release) {
      if (err) return reply.send(err);
      console.log('FINDING USER: ', request.params.id);
      client.query(`DELETE FROM users WHERE id=${request.params.id}`, function onResult(err, result) {
        release();
        reply.send(err || `Deleted: ${request.params.id}`);
      });
    }
  },
});

//UPDATE ONE USER fields
fastify.route({
  method: 'PUT',
  url: '/users/:id',
  handler: async function (request, reply) {
    fastify.pg.connect(onConnect);
    async function onConnect(err, client, release) {
      if (err) return reply.send(err);
      const oldUserReq = await client.query(`SELECT * from users where id=${request.params.id}`);
      const oldUser = oldUserReq.rows[0];
      console.log('Updating with ', request.body);
      client.query(
        `UPDATE users SET(name,description,tweets) = ('${request.body.name}', '${request.body.description || oldUser.description}', ${
          request.body.tweets || oldUser.tweets
        })
      WHERE id=${request.params.id}`,
        function onResult(err, result) {
          release();
          reply.send(err || `Updated: ${request.params.id}`);
        }
      );
    }
  },
});

//Create users
fastify.route({
  method: 'POST',
  url: '/users',
  schema: {
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
      client.query(
        `INSERT into users (id,name,description,tweets) VALUES(${newUser.id},'${newUser.name}','${newUser.description}',${newUser.tweets})`,
        function onResult(err, result) {
          release();
          reply.send(err || result);
        }
      );
    }
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
