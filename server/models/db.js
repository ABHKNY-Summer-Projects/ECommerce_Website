<<<<<<< HEAD
const { Pool } = require('pg');

const connectionString = "postgresql://summer01_user:rkfjpGTSX1aLYzQydXDnWBA27wB7xSfN@dpg-cqh3aaaju9rs73eff2u0-a.oregon-postgres.render.com/summer01";

const client = new Pool({
    max: 5,
    min: 2,
    idleTimeoutMillis: 600000,
    connectionString: connectionString,
    ssl: {
        require: true
    }
});

client.connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Error connecting to the database: ", err.stack);
    });

module.exports = client;
=======
const {Client} = require('pg')

const connection = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: "Yonatize",
    database: 'Products'
})

connection.connect()
.then(()=>{
    console.log('connected to database');
})
.catch(err=>{
    console.log('error occured while conecting to db')
})

module.exports = connection
>>>>>>> master
