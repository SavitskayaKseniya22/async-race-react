"use client";

import { CarType } from "@/type";
import { useState, useCallback } from "react";
import { KeyedMutator } from "swr";
import ControlPanel from "./ControlPanel";
import Track from "./Track";

export default function Garage({
  result,
}: {
  result: { data: CarType[]; mutate: KeyedMutator<CarType[] | undefined> };
}) {
  const { data, mutate } = result;

  const [raceStatus, setRaceStatus] = useState<"race" | "solo" | "finish" | "hold">("hold");

  const [racers, setRacers] = useState<{ id: string; promise: () => Promise<CarType & { newTime: number }> }[]>([]);

  const func = useCallback(() => {
    const promises = racers.map(async (racer) => {
      return await racer.promise();
    });

    Promise.any(promises)
      .then((res) => {
        console.log("got winner", res);
        return fetch("/api/car", {
          method: "PUT",
          body: JSON.stringify({
            updateType: "wins",
            id: res.id,
            wins: res.wins + 1,
            time: res.newTime < res.time || res.time === 0 ? res.newTime : res.time,
          }),
        });
      })
      .then(() => {
        console.log("wins updated");
      })
      .catch((error) => {
        console.log(error);
        console.log("no winner found");
      })
      .finally(() => {});

    Promise.allSettled(promises)
      .then((res) => {
        console.log("race is over", res);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setRaceStatus("finish");
        mutate();
      });
  }, [mutate, racers]);

  return (
    <>
      <ControlPanel
        onRaceStart={() => {
          setRaceStatus("race");
          func();
        }}
        onRaceReset={() => {
          setRacers([]);
          setRaceStatus("hold");
        }}
        raceStatus={raceStatus}
      ></ControlPanel>
      <ul className="flex flex-col gap-4">
        {data.map((item: CarType) => {
          return (
            <Track
              key={item.id}
              car={item}
              returnPromise={setRacers}
              racers={racers}
              raceStatus={raceStatus}
              setRaceStatus={setRaceStatus}
            ></Track>
          );
        })}
      </ul>
    </>
  );
}
