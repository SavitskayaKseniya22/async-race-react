"use client";

import { useState } from "react";
import Header from "./lib/Header";
import Track from "./lib/Track";
import { CarType } from "@/type";
import useSWR from "swr";
import ControlPanel from "./lib/ControlPanel";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, error, isLoading, mutate } = useSWR(`/api/cars?page=${pageNumber}`, fetcher);

  if (error) return <div>ошибка загрузки</div>;
  if (isLoading) return <div>загрузка...</div>;
  return (
    <>
      <ControlPanel mutate={mutate}></ControlPanel>
      <main className="flex grow flex-col justify-between p-2">
        {data && (
          <ul className="flex flex-col gap-4">
            {data.map((item: CarType) => {
              return <Track key={item.id} car={item} mutate={mutate}></Track>;
            })}
          </ul>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber((i) => i - 1);
              }
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setPageNumber((i) => i + 1);
            }}
          >
            Next
          </button>
          {pageNumber}
        </div>
      </main>
    </>
  );
}
