import { NextRequest } from "next/server";
import client from "../db";
import { getRandomColor, generateId } from "@/utils";

async function getCars() {
  try {
    await client.connect();

    const db = client.db("Race-app");
    const cars = await db.collection("garage").find().toArray();
    return cars;
  } finally {
    await client.close();
  }
}

export async function GET() {
  const cars = await getCars();
  return Response.json(cars);
}

async function deleteCars() {
  try {
    await client.connect();
    const db = client.db("Race-app");
    const result = await db.collection("garage").deleteMany();
    return result;
  } finally {
    await client.close();
  }
}

export async function DELETE() {
  await deleteCars();
  return Response.json({ message: "All cars have been deleted successfully." });
}

async function createCars(request: Request) {
  try {
    await client.connect();
    const body = await request.json();
    const db = client.db("Race-app");
    const result = await db.collection("garage").insertMany(body.cars);
    return result;
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  await createCars(request);
  return Response.json({ message: "The cars hav been created successfully." });
}
