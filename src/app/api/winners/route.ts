import client from "../db";

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
