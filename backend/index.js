import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db.connect/connectDB.js";
import cors from "cors";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
import imgRouter from "./Routes/images.routes.js";

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.use("/api", imgRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server running on port ${process.env.PORT}`);
});
