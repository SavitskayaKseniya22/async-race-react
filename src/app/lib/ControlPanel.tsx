"use client";

import { generateId, getRandomColor, getRandomName } from "@/utils";
import { mutate } from "swr";
import CarViewForm from "./CarViewForm";

export default function ControlPanel({
  onRaceStart,
  onRaceReset,
  raceStatus,
}: {
  onRaceStart: () => void;
  onRaceReset: () => void;
  raceStatus: "race" | "solo" | "finish" | "hold";
}) {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      <CarViewForm type="Create"></CarViewForm>

      <ul className="flex gap-2">
        <li>
          <button type="button" className="btn" onClick={onRaceStart} disabled={raceStatus !== "hold"}>
            Race
          </button>
        </li>
        <li>
          <button type="button" className="btn" onClick={onRaceReset} disabled={raceStatus !== "finish"}>
            Reset
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn"
            onClick={async () => {
              try {
                await fetch("/api/cars", { method: "DELETE" });
                mutate(`/api/cars?page=1`);
              } catch (error) {
                console.log(error);
              }
            }}
            disabled={raceStatus !== "hold"}
          >
            Remove cars
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn"
            onClick={async () => {
              try {
                const response = await fetch("./api/carNames");
                const carNames = await response.json();
                const cars = new Array(10).fill(0).map(() => {
                  return {
                    name: getRandomName(carNames),
                    color: getRandomColor(),
                    id: generateId(),
                    wins: 0,
                    time: 0,
                  };
                });

                await fetch("/api/cars", { method: "POST", body: JSON.stringify({ cars }) });
                mutate(`/api/cars?page=1`);
              } catch (error) {
                console.log(error);
              }
            }}
            disabled={raceStatus !== "hold"}
          >
            Generate cars
          </button>
        </li>
      </ul>
    </div>
  );
}
