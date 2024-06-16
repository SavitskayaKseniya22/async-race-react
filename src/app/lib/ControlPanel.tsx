"use client";

import { generateId, getRandomColor, getRandomName } from "@/utils";
import { usePathname } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

export default function ControlPanel() {
  const pathname = usePathname();

  const colorInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  if (pathname === "winners") {
    return <></>;
  } else {
    return (
      <div className="absolute right-4 top-4 flex w-1/3 flex-col gap-2">
        <form
          className="flex gap-2"
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const carName = formData.get("carName");
            const carColor = formData.get("carColor");

            try {
              await fetch("/api/car", { method: "POST", body: JSON.stringify({ carName, carColor }) });
              form.reset();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <input
            type="text"
            className="input grow"
            placeholder="Enter car name"
            name="carName"
            required
            ref={nameInput}
            onFocus={async (e) => {
              if (e.target.value === "") {
                try {
                  const response = await fetch("./api/carNames");
                  const carNames = await response.json();
                  const randomName = getRandomName(carNames);
                  e.target.value = randomName;
                } catch (error) {
                  console.log(error);
                }
              }
            }}
          />
          <input
            type="color"
            name="carColor"
            ref={colorInput}
            onFocus={(e) => {
              if (e.target.value === "#000000") {
                const randomColor = getRandomColor();
                e.target.value = randomColor;
              }
            }}
          />
          <button
            className="btn"
            type="button"
            onClick={async () => {
              const carName = nameInput.current;
              const carColor = colorInput.current;

              if (carName) {
                try {
                  const response = await fetch("./api/carNames");
                  const carNames = await response.json();
                  const randomName = getRandomName(carNames);
                  carName.value = randomName;
                } catch (error) {
                  console.log(error);
                }
              }
              if (carColor) {
                const randomColor = getRandomColor();
                carColor.value = randomColor;
              }
            }}
          >
            <ArrowPathIcon className="size-6 text-white" />
          </button>
          <button className="btn" type="submit">
            Create
          </button>
        </form>

        <ul className="flex gap-2">
          <li>
            <button type="button" className="btn">
              Race
            </button>
          </li>
          <li>
            <button type="button" className="btn">
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
                } catch (error) {
                  console.log(error);
                }
              }}
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

                  console.log(cars);
                  await fetch("/api/cars", { method: "POST", body: JSON.stringify({ cars }) });
                } catch (error) {}
              }}
            >
              Generate cars
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
