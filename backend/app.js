import express from "express";
import dotenv from "dotenv";
import { cars } from "./schema.js";
import { db } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/cars", async (req, res) => {
  const { make, model, year, price } = req.body;
  console.log("req.body", req.body);

  if (!make || !model || !year || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newCar = await db
    .insert(cars)
    .values({ make, model, year, price })
    .returning();

  res.status(201).json(newCar);
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
