"use client";

import { CarStartedResponse, CarType, EngineDataType } from "@/type";
import Image from "next/image";
import { useRef, useState } from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { KeyedMutator } from "swr";
import CarView from "./CarView";
import { motion, useAnimationControls } from "framer-motion";
import { getTime } from "@/utils";

function isCarStartedResponse(x: any): x is EngineDataType {
  return x.velocity && typeof x.velocity === "number" && x.distance !== undefined && typeof x.distance === "number";
}

function isCarDrivedResponse(x: any): x is { success: boolean } {
  return x.success !== undefined && typeof x.success === "boolean";
}

export default function Track({ car, mutate }: { car: CarType; mutate: KeyedMutator<any> }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const controls = useAnimationControls();

  const colorInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  return (
    <li className="flex flex-col border-b-4 border-dashed border-indigo-600 bg-white p-2">
      <div className="flex gap-24">
        <h3 className="block w-1/4 text-xl font-bold">{car.name}</h3>
        <div className="flex items-center gap-1">
          <TrophyIcon className="w-6 text-orange-300"></TrophyIcon>
          <span className="font-bold">{car.wins}</span>
        </div>
        <ul className="flex gap-2">
          <li>
            <button
              type="button"
              className="btn"
              disabled={isRunning || isDirty}
              onClick={async () => {
                setIsDirty(true);
                setIsRunning(true);
                fetch("/api/car", {
                  method: "PATCH",
                  body: JSON.stringify({ id: car.id, status: "started" }),
                })
                  .then((response) => response.json())
                  .then((response) => {
                    console.log(response);
                    if (isCarStartedResponse(response)) {
                      const time = getTime(response.velocity, response.distance);
                      controls.start({ left: "95%", transition: { duration: time / 1000 } });
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
                      console.log(2, response);
                    } else {
                      throw new Error(response);
                    }
                  })
                  .catch((e) => {
                    console.error(e);
                    controls.stop();
                  })
                  .finally(() => {
                    setIsRunning(false);
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
              disabled={isRunning || !isDirty}
              onClick={() => {
                controls.set({ left: 0 });
                setIsDirty(false);
              }}
            >
              Reset
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn"
              disabled={isRunning}
              onClick={async () => {
                try {
                  await fetch("/api/car", { method: "DELETE", body: JSON.stringify({ id: car.id }) });
                  mutate();
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
              disabled={isRunning}
              onClick={() => {
                setIsOpen((value) => !value);
              }}
            >
              Update
            </button>
            {isOpen && (
              <form
                className="flex gap-2"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const carName = formData.get("carName");
                  const carColor = formData.get("carColor");

                  try {
                    await fetch("/api/car", { method: "PUT", body: JSON.stringify({ id: car.id, carName, carColor }) });
                    form.reset();
                    mutate();
                    setIsOpen(false);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <input
                  type="text"
                  className="input grow"
                  placeholder="Change car name"
                  defaultValue={car.name}
                  name="carName"
                  ref={nameInput}
                />
                <input type="color" defaultValue={car.color} name="carColor" ref={colorInput} />
                <button type="submit" className="btn">
                  Update
                </button>
              </form>
            )}
          </li>
        </ul>
      </div>

      <div className="flex justify-between p-2">
        <motion.span animate={controls} className="relative left-0">
          <CarView color={car.color}></CarView>
        </motion.span>

        <Image src="/images/flag.svg" width={30} height={40} alt="Flag" />
      </div>
    </li>
  );
}
