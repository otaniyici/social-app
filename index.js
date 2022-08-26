const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
require("express-async-errors");

const userRoute = require("./routes/usersRoutes");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/postsRoutes");

const errorHandlerMiddleware = require("./middleware/error-handler");

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// routers
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// error handling
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected!");
    app.listen(3000, () => {
      console.log("Server listening...");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
