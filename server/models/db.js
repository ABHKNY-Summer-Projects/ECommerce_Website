const {Client} = require("pg")
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let client = new Client({
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DBNAME
})


client.connect()
.then(()=>{
    console.log("Database connected successfully")
}
)
.catch((err) => {
    console.log(process.env.DBNAME)
    console.error("Error connecting to the database: ", err.stack)
})

module.exports = client;
