const express = require("express")
const cors = require("cors")
const paymentRouter = require('./routes/paymentRoutes')
const dotenv = require("dotenv")
dotenv.config()
const app = express()


app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    console.log(req.body)
    res.send("Hello World")
})

app.use("/api",paymentRouter);

const port = process.env.PORT || 8080
try {
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`)
    })
}
catch(error) {
    console.log(error)
    process.exit(1)
}


