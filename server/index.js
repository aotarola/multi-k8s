'use strict';

const keys = require('./keys');

const express = require('express');
const bodtParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodtParser.json());

// Postgres Client Setup

const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

//eslint-disable-next-line no-console
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values(number INT)')
  // eslint-disable-next-line no-console
  .catch(err => console.log(err));

// Redis Client Setup

const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get('/', (_, res) => {
  res.send('Hi!!');
});

app.get('/values/all', async (_, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (_, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.send({ working: true });
});

app.listen(5000, err => {
  // eslint-disable-next-line no-console
  console.log('Listening');
});
