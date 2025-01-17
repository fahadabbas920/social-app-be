const express = require('express');
const cors = require('cors');
const app = express();
const auth = require("./routes/auth")
const posts = require("./routes/posts")
const connectDB = require("./db/connect");
const authorize = require('./middlewares/authorize');
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_project';
// const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

app.use("/auth", auth);
app.use("/posts", authorize);
app.use("/posts", posts);


app.get("*", (req, res) => {
    res.status(404).json({ success: false, message: "Invalid Api Request" });
  });
  
// app.use(errorHandlerMiddlware);

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI).then(() => {
        console.log("db connected");
      });
      app.listen(5000, () => {
        console.log("server is listening on port: 5000");
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
