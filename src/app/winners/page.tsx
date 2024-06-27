"use client";

import { CarType } from "@/type";
import useSWR from "swr";
import WinnersTable from "./lib/WinnersTable";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR<CarType[] | undefined>(`/api/winners`, fetcher);

  if (error) return <div>ошибка загрузки</div>;
  if (isLoading) return <div>загрузка...</div>;
  if (data) {
    data.map((item) => {
      return <>{item.id}</>;
    });
  }

  return (
    <main className="flex grow flex-col justify-between p-2">
      {error && <div>ошибка загрузки</div>}
      {isLoading && <div>загрузка...</div>}
      {data && <WinnersTable data={data}></WinnersTable>}
    </main>
  );
}
