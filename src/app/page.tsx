"use client";

import { useEffect, useState } from "react";
import Header from "./lib/Header";
import Track from "./lib/Track";
import { CarType } from "@/type";

export default function Page() {
  const [cars, setCars] = useState<CarType[] | null>(null);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        console.log(data);
        //TODO typeguard or query type and type guard for body
        setCars(data);
      } catch (error) {
        console.log(error);
      }
    };

    func();

    return () => {};
  }, []);

  return (
    <>
      <Header></Header>
      <main>
        {cars && (
          <ul className="flex flex-col gap-4 p-4">
            {cars.map((item) => {
              return <Track key={item.id} car={item}></Track>;
            })}
          </ul>
        )}
      </main>
    </>
  );
}
