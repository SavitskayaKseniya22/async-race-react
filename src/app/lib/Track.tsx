"use client";

import { CarType, EngineDataType } from "@/type";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import CarView from "./CarView";
import { motion, useAnimationControls } from "framer-motion";
import { getTime } from "@/utils";
import TrophyWidget from "./TrophyWidget";
import CarViewForm from "./CarViewForm";
import { mutate } from "swr";

function isCarStartedResponse(x: any): x is EngineDataType {
  return x.velocity && typeof x.velocity === "number" && x.distance !== undefined && typeof x.distance === "number";
}

function isCarDrivedResponse(x: any): x is { success: boolean } {
  return x.success !== undefined && typeof x.success === "boolean";
}

export default function Track({
  car,
  returnPromise,
  racers,
  raceStatus,
  setRaceStatus,
}: {
  car: CarType;
  raceStatus: "race" | "solo" | "finish" | "hold";
  setRaceStatus: Dispatch<SetStateAction<"race" | "solo" | "finish" | "hold">>;
  returnPromise: Dispatch<
    SetStateAction<
      {
        id: string;
        promise: () => Promise<CarType & { newTime: number }>;
      }[]
    >
  >;
  racers: {
    id: string;
    promise: () => Promise<CarType & { newTime: number }>;
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [soloRaceStatus, setSoloRaceStatus] = useState<"solo" | "finish" | "hold">("hold");

  const controls = useAnimationControls();

  const race = useCallback(() => {
    let time: number;
    setSoloRaceStatus("solo");
    return fetch("/api/car", {
      method: "PATCH",
      body: JSON.stringify({ id: car.id, status: "started" }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (isCarStartedResponse(response)) {
          time = getTime(response.velocity, response.distance);
          controls.start({ left: "92%", transition: { duration: time / 1000 } });
        } else {
          throw new Error(response);
        }
      })
      .then(() => {
        return fetch("/api/car", {
          method: "PATCH",
          body: JSON.stringify({ id: car.id, status: "drive" }),
        });
      })
      .then((response) => response.json())
      .then((response) => {
        if (isCarDrivedResponse(response)) {
          return { ...car, newTime: time };
        } else {
          throw new Error(response);
        }
      })
      .catch((e) => {
        console.error(e);
        controls.stop();
        return Promise.reject(e);
      })
      .finally(() => {
        setSoloRaceStatus("finish");
      });
  }, [car, controls]);

  useEffect(() => {
    if (racers.length === 0) {
      returnPromise((a) => {
        if (!a.find((element) => element.id === car.id)) {
          return a.concat([{ id: car.id, promise: race }]);
        } else return a;
      });
      controls.start({ left: 0 });
      setSoloRaceStatus("hold");
    }
  }, [racers]);

  return (
    <li className="flex flex-col border-b-4 border-dashed border-indigo-600 bg-white p-2">
      <div className="flex gap-24">
        <h3 className="block w-1/4 text-xl font-bold">{car.name}</h3>
        <ul className="flex gap-2">
          <li>
            <button
              type="button"
              className="btn"
              disabled={raceStatus !== "hold" && soloRaceStatus !== "hold"}
              onClick={() => {
                setRaceStatus("solo");

                race().finally(() => {
                  setRaceStatus("finish");
                });
              }}
            >
              Start
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn"
              disabled={raceStatus !== "finish" || soloRaceStatus !== "finish"}
              onClick={() => {
                controls.start({ left: 0 });
                setSoloRaceStatus("hold");
                //setRaceStatus("hold");
              }}
            >
              Reset
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn"
              disabled={raceStatus !== "hold" && soloRaceStatus !== "hold"}
              onClick={async () => {
                try {
                  await fetch("/api/car", { method: "DELETE", body: JSON.stringify({ id: car.id }) });
                  mutate(`/api/cars?page=1`);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Remove
            </button>
          </li>
          <li className="flex gap-4">
            <button
              type="button"
              className="btn"
              disabled={raceStatus !== "hold" && soloRaceStatus !== "hold"}
              onClick={() => {
                setIsOpen((value) => !value);
              }}
            >
              Update
            </button>
            {isOpen && <CarViewForm type="Update" defaultValues={car}></CarViewForm>}
          </li>
        </ul>
      </div>

      <div className="flex items-end justify-between px-8">
        <motion.span animate={controls} className="relative" initial={{ left: 0 }}>
          <CarView color={car.color}></CarView>
        </motion.span>
        <TrophyWidget wins={car.wins}></TrophyWidget>
      </div>
    </li>
  );
}
