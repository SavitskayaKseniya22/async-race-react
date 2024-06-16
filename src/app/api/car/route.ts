import { generateId } from "@/utils";
import client from "../db";
import { NextRequest } from "next/server";

async function postCar(request: Request) {
  try {
    await client.connect();
    const body = await request.json();
    const db = client.db("Race-app");
    const result = await db
      .collection("garage")
      .insertOne({ name: body.carName, color: body.carColor, id: generateId(), wins: 0, time: 0 });

    return result;
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  await postCar(request);
  return Response.json({ message: "The car has been added successfully." });
}

async function deleteCar(request: Request) {
  try {
    await client.connect();
    const body = await request.json();
    const db = client.db("Race-app");
    const result = await db.collection("garage").deleteOne({ id: body.id });

    return result;
  } finally {
    await client.close();
  }
}

export async function DELETE(request: NextRequest) {
  await deleteCar(request);
  return Response.json({ message: "The car has been deleted successfully." });
}

async function updateCar(request: Request) {
  try {
    await client.connect();
    const body = await request.json();
    const db = client.db("Race-app");
    const result = await db
      .collection("garage")
      .findOneAndUpdate({ id: body.id }, { $set: { name: body.carName, color: body.carColor } });

    return result;
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  await updateCar(request);
  return Response.json({ message: "The car has been updated successfully." });
}
