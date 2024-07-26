const {Client, Pool} = require("pg")
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let client;
if (process.env.ENVIRONMENT === "development") {

    client = new Client({
        user: process.env.DBUSER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.DBPORT,
        database: process.env.DBNAME
    })
}

else {

    const connectionString = "postgresql://summer01_user:rkfjpGTSX1aLYzQydXDnWBA27wB7xSfN@dpg-cqh3aaaju9rs73eff2u0-a.oregon-postgres.render.com/summer01"
    client = new Pool({
        max: 5,
        min: 2,
        idleTimeoutMillis: 600000,
        connectionString: connectionString,
        ssl : {
            require: true
        }
    })
}

client.connect()
.then(()=>{
    console.log("Database connected successfully")
}
)
.catch((err) => {
    console.error("Error connecting to the database: ", err.stack)
})

module.exports = client;

