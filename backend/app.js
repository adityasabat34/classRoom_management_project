import express from "express";
import dotenv from "dotenv";
import { cars } from "./schema.js";
import { db } from "./config/db.js";
import { eq } from "drizzle-orm";

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

app.get("/cars", async (req, res) => {
  const getAllCars = await db.select().from(cars);

  res.status(200).json(getAllCars);
});

app.put("/cars/:id", async (req, res) => {
  const { id } = req.params;
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const updatedCar = await db
    .update(cars)
    .set({ make, model, year, price })
    .where(eq(cars.id, id))
    .returning();

  res.status(200).json(updatedCar);
});

app.delete("/cars/:id", async (req, res) => {
  const { id } = req.params;

  const deletedCar = await db.delete(cars).where(eq(cars.id, id)).returning();

  res.status(200).json(deletedCar);
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
