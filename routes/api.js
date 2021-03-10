var express = require('express');
const { Client } = require("cassandra-driver");
var path = require('path');
var fetch = require('cross-fetch');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/env', function (req, res, next) {
    console.log(process.env);
    res.send({ status: 'ok', 'env': process.env })
});

router.get('/list', function (req, res, next) {
    rs = get_from_cassandra(res);
});

router.post('/get', (request, response) => {
    get_cassandra_client();
    if (request.body === null ||
        request.body === undefined ){
      
        res.send({ status: 'missing body' });
    }
    if (request.body['name'] !== null &&
        request.body['name'] !== undefined) {
        get_from_cassandra_by_name(request.body['name'], response);
    }
});


router.post('/save', (request, response) => {
    save_to_cassandra(request.body);
    response.status(204).send();
});

router.post('/saveimg', (request, response) => {
    save_to_minio(request.body);
    response.status(204).send();
});


router.post('/getimg', (request, response) => {
    get_from_minio(request.body);
});


var cassandra_client;

async function get_cassandra_client() {
    //console.log(`using connect bundle ${process.env.ASTRA_SECURE_CONNECT_BUNDLE}`);

    if (cassandra_client === null || cassandra_client === undefined) {
        cassandra_client = new Client({
            cloud: {
                secureConnectBundle: `${process.env.ASTRA_SECURE_CONNECT_BUNDLE}`,
            },
            credentials: { username: `${process.env.ASTRA_DB_USERNAME}`, password: `${process.env.ASTRA_DB_PASSWORD}` },
        });
        await cassandra_client.connect();
    }
}

async function get_from_cassandra_by_name(name, res) {
    get_cassandra_client();
    var db = `${process.env.ASTRA_DB_KEYSPACE}.${process.env.ASTRA_DB_TABLE}`;
    var response = await cassandra_client.execute(
        `SELECT * FROM ${db} WHERE name = ?  ALLOW FILTERING `, [name]);
    console.log(response);
    res.send({ status: 'ok', 'rows': response.rows });
}



async function save_to_cassandra(body) {
    get_cassandra_client();
    var db = `${process.env.ASTRA_DB_KEYSPACE}.${process.env.ASTRA_DB_TABLE}`;

    const query = 
      `INSERT INTO ${db} (name, toptext, bottomtext, votes, uuid) VALUES (?,  ?, ?, ?, ?) `;
    const params = 
       [ body['name'],  body['toptext'], body['bottomtext'], body['votes'],body['uuid'] ];
    console.log('save', params);
    await cassandra_client.execute(query, params, { prepare: true })
}

async function shutdown_cassandra_client() {
    await cassandra_client.shutdown();
}

async function get_from_cassandra(res) {
    get_cassandra_client();
    var db = `${process.env.ASTRA_DB_KEYSPACE}.${process.env.ASTRA_DB_TABLE}`;
    var rs = await cassandra_client.execute(
        `SELECT * FROM ${db} PER PARTITION LIMIT 1`);
    for (i = 0; i < rs.rowLength; i++) {
        row = rs.rows[i];
        console.log(row, row['key']);
    }
    res.send({ status: 'ok', 'rows': rs })
}

module.exports = [router];