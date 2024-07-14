import { generateId } from "@/utils";
import client from "../db";
import { NextRequest, NextResponse } from "next/server";

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
    if (body.updateType === "view") {
      const result = await db
        .collection("garage")
        .findOneAndUpdate({ id: body.id }, { $set: { name: body.carName, color: body.carColor } });
      return result;
    } else if (body.updateType === "wins") {
      const result = await db
        .collection("garage")
        .findOneAndUpdate({ id: body.id }, { $set: { wins: body.wins, time: body.time } });
      return result;
    }
  } finally {
    await client.close();
  }
}

export async function PUT(request: NextRequest) {
  await updateCar(request);
  return Response.json({ message: "The car has been updated successfully." });
}

const state: { velocity: { [x: string]: number }; blocked: { [x: string]: boolean } } = {
  velocity: {},
  blocked: {},
};

async function raceCar(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const distance = 500000;

    if (!id || !status || !/^(started)|(stopped)|(drive)$/.test(status)) {
      return {
        message:
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"',
        code: 400,
      };
    }

    client
      .db("Race-app")
      .collection("garage")
      .findOne({ id })
      .then((result) => {
        if (!result) {
          return {
            message: "Car with such id was not found in the garage.",
            code: 404,
          };
        }
      });

    if (status === "drive") {
      const velocity = state.velocity[id];

      if (!velocity) {
        return {
          message:
            'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?',
          code: 404,
        };
      }

      if (state.blocked[id]) {
        return {
          message: "Drive already in progress. You can't run drive for the same car twice while it's not stopped.",
          code: 429,
        };
      }

      state.blocked[id] = true;

      const x = Math.round(distance / velocity);

      if (new Date().getMilliseconds() % 3 === 0) {
        await new Promise((resolve) => setTimeout(resolve, (Math.random() * x) ^ 0));
        delete state.velocity[id];
        delete state.blocked[id];
        return {
          message: "Car has been stopped suddenly. It's engine was broken down.",
          code: 500,
        };
      } else {
        await new Promise((resolve) => setTimeout(resolve, x));
        delete state.velocity[id];
        delete state.blocked[id];

        return {
          message: { success: true },
          code: 200,
        };
      }
    } else {
      const x = (Math.random() * 2000) ^ 0;

      const velocity = status === "started" ? Math.max(50, (Math.random() * 200) ^ 0) : 0;

      if (velocity) {
        state.velocity[id] = velocity;
      } else {
        delete state.velocity[id];
        delete state.blocked[id];
      }

      await new Promise((resolve) => setTimeout(resolve, x));
      return {
        message: { velocity, distance },
        code: 200,
      };
    }
  } catch (error) {
    await client.close();
    return { code: 401, message: "Unexpected error" };
  }
}

export async function PATCH(request: NextRequest) {
  const res = await raceCar(request);

  return NextResponse.json(res.message, {
    status: res.code,
    statusText: res.code !== 200 ? (res.message as string) : "",
  });
}
