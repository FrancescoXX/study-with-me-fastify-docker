async function routes(fastify, options) {
  // Testing route
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  // INIT TABLE. Launch just once to create the table
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

  //GET AL USERS
  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) return reply.send(err);
        client.query('SELECT * from users', function onResult(err, result) {
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
          release();
          reply.send(err || result.rows[0]);
        });
      }
    },
  });

  //Create users
  fastify.route({
    method: 'POST',
    url: '/users',
    handler: function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) return reply.send(err);
        const newUser = request.body;
        client.query(
          `INSERT into users (name,description,tweets) VALUES('${newUser.name}','${newUser.description}',${newUser.tweets})`,
          function onResult(err, result) {
            release();
            reply.send(err || result);
          }
        );
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

  //DELETE ONE USER if exists
  fastify.route({
    method: 'DELETE',
    url: '/users/:id',
    handler: async function (request, reply) {
      fastify.pg.connect(onConnect);
      function onConnect(err, client, release) {
        if (err) return reply.send(err);
        client.query(`DELETE FROM users WHERE id=${request.params.id}`, function onResult(err, result) {
          release();
          reply.send(err || `Deleted: ${request.params.id}`);
        });
      }
    },
  });
}

module.exports = routes;
