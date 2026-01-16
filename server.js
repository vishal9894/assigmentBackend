const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/auth");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const porfileRoute = require("./routes/profileRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/auth", userRoute);
app.use("/api/", porfileRoute);

app.listen(PORT, () => {
  console.log(`server is running port ${PORT}`);
});
