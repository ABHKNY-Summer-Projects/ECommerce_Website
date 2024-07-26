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