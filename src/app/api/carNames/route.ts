import { NextResponse } from "next/server";
import cars from "./carNames.json";

export async function GET() {
  return NextResponse.json(cars);
}
