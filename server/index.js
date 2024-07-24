const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    console.log(req.body);
    res.send("Hello World");
});

app.use("/api/users", userRouter)

const port = process.env.PORT || 8080;
try {
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}
