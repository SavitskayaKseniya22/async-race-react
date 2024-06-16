"use client";

import { CarType } from "@/type";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Track({ car }: { car: CarType }) {
  const [isOpen, setIsOpen] = useState(false);

  const colorInput = useRef<HTMLInputElement | null>(null);
  const nameInput = useRef<HTMLInputElement | null>(null);

  return (
    <li className="flex flex-col border-b-4 border-dashed border-indigo-600 bg-white p-2">
      <div className="flex gap-24">
        <h3 className="text-2xl font-bold">{car.name}</h3>
        <ul className="flex gap-2">
          <li>
            <button type="button" className="btn">
              Start
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
                  await fetch("/api/car", { method: "DELETE", body: JSON.stringify({ id: car.id }) });
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
        <svg height="64" width="64" viewBox="0 0 512 256" fill={car.color} transform="matrix(-1, 0, 0, 1, 0, 0)">
          <g>
            <path d="M500.325,211.661l-34.024-54.143c-11.508-18.302-31.61-29.402-53.216-29.402H254.645 c-26.654,0-52.195,10.719-70.849,29.745l-45.216,46.107L30.738,228.933C12.733,233.11,0,249.147,0,267.615v42.348 c0,9.122,7.406,16.538,16.538,16.538h57.336c-0.074,1.141-0.185,2.274-0.185,3.425c0,29.8,24.167,53.958,53.977,53.958 c29.792,0,53.958-24.158,53.958-53.958c0-1.151-0.111-2.284-0.185-3.425h169.67c-0.074,1.141-0.185,2.274-0.185,3.425 c0,29.8,24.166,53.958,53.958,53.958c29.81,0,53.958-24.158,53.958-53.958c0-1.151-0.092-2.284-0.166-3.425h36.789 c9.132,0,16.538-7.416,16.538-16.538v-57.81C512,237.824,507.954,223.801,500.325,211.661z M127.666,351.43 c-11.879,0-21.494-9.643-21.494-21.504c0-11.871,9.615-21.495,21.494-21.495c11.86,0,21.494,9.624,21.494,21.495 C149.16,341.786,139.526,351.43,127.666,351.43z M264.13,215.754h-97.188l37.198-37.93c13.216-13.476,31.628-21.198,50.505-21.198 h9.486V215.754z M374.998,215.754h-85.94v-59.128h85.94V215.754z M404.882,351.43c-11.86,0-21.494-9.643-21.494-21.504 c0-11.871,9.634-21.495,21.494-21.495c11.879,0,21.494,9.624,21.494,21.495C426.376,341.786,416.761,351.43,404.882,351.43z M399.944,215.754v-59.128h13.142c11.879,0,22.756,6.004,29.067,16.065l27.062,43.063H399.944z" />
          </g>
        </svg>
        <Image src="/images/flag.svg" width={30} height={40} alt="Flag" />
      </div>
    </li>
  );
}
