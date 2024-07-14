"use client";

import { useState } from "react";
import { CarType } from "@/type";
import useSWR from "swr";
import Garage from "./lib/Garage";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page() {
  const [pageNumber, setPageNumber] = useState(1);
  const result = useSWR<CarType[] | undefined>(`/api/cars?page=${pageNumber}`, fetcher);
  const { data, error, isLoading, mutate } = result;

  return (
    <>
      <main className="flex grow flex-col justify-between p-2">
        {error && <div>ошибка загрузки</div>}
        {isLoading && <div>загрузка...</div>}
        {data && <Garage result={{ data, mutate }}></Garage>}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn"
            disabled={isLoading || error || pageNumber === 1}
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber((i) => i - 1);
              }
            }}
          >
            Prev
          </button>
          {pageNumber}
          <button
            type="button"
            className="btn"
            disabled={isLoading || error}
            onClick={() => {
              setPageNumber((i) => i + 1);
            }}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}
