"use client";

import CarView from "@/app/lib/CarView";
import { CarType, WinnersOrderType, WinnersSortType } from "@/type";
import { useState } from "react";
import { ArrowLongDownIcon, ArrowLongUpIcon } from "@heroicons/react/24/outline";

export default function WinnersTable({ data }: { data: CarType[] }) {
  const [sortType, setSortType] = useState(WinnersSortType.NAME);
  const [orderType, setOrderType] = useState(WinnersOrderType.ASC);

  return (
    <table className="w-[650px] border-separate self-center border">
      <thead>
        <tr>
          <th className="border">
            <input
              type="radio"
              id="id"
              name="sort"
              value="id"
              checked={sortType === WinnersSortType.NAME}
              className="hidden"
              onClick={() => {
                if (sortType === WinnersSortType.NAME) {
                  setOrderType((a) => (a === WinnersOrderType.ASC ? WinnersOrderType.DESC : WinnersOrderType.ASC));
                }
              }}
              onChange={() => {
                setSortType(WinnersSortType.NAME);
              }}
            />
            <label
              htmlFor="id"
              data-sort="id"
              className={`relative flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 ${sortType === WinnersSortType.NAME ? "text-red-600" : ""}`}
            >
              Name
              {sortType === WinnersSortType.NAME &&
                (orderType === WinnersOrderType.ASC ? (
                  <ArrowLongDownIcon className="absolute right-2 top-2 h-6 w-6" />
                ) : (
                  <ArrowLongUpIcon className="absolute right-2 top-2 h-6 w-6" />
                ))}
            </label>
          </th>
          <th className="border px-8 py-4">Car</th>

          <th className="border">
            <input
              type="radio"
              id="wins"
              name="sort"
              value="wins"
              checked={sortType === WinnersSortType.WINS}
              className="hidden"
              onClick={() => {
                if (sortType === WinnersSortType.WINS) {
                  setOrderType((a) => (a === WinnersOrderType.ASC ? WinnersOrderType.DESC : WinnersOrderType.ASC));
                }
              }}
              onChange={() => {
                setSortType(WinnersSortType.WINS);
              }}
            />
            <label
              htmlFor="wins"
              data-sort="wins"
              className={`relative flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 ${sortType === WinnersSortType.WINS ? "text-red-600" : ""}`}
            >
              Wins
              {sortType === WinnersSortType.WINS &&
                (orderType === WinnersOrderType.ASC ? (
                  <ArrowLongDownIcon className="absolute right-2 top-2 h-6 w-6" />
                ) : (
                  <ArrowLongUpIcon className="absolute right-2 top-2 h-6 w-6" />
                ))}
            </label>
          </th>
          <th className="border">
            <input
              type="radio"
              id="time"
              name="sort"
              value="time"
              checked={sortType === WinnersSortType.TIME}
              className="hidden"
              onClick={() => {
                if (sortType === WinnersSortType.TIME) {
                  setOrderType((a) => (a === WinnersOrderType.ASC ? WinnersOrderType.DESC : WinnersOrderType.ASC));
                }
              }}
              onChange={() => {
                setSortType(WinnersSortType.TIME);
              }}
            />
            <label
              htmlFor="time"
              data-sort="time"
              className={`relative flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 ${sortType === WinnersSortType.TIME ? "text-red-600" : ""}`}
            >
              Best time (s)
              {sortType === WinnersSortType.TIME &&
                (orderType === WinnersOrderType.ASC ? (
                  <ArrowLongDownIcon className="absolute right-2 top-2 h-6 w-6" />
                ) : (
                  <ArrowLongUpIcon className="absolute right-2 top-2 h-6 w-6" />
                ))}
            </label>
          </th>
        </tr>
      </thead>
      <tbody className="border">
        {data
          .sort((a, b) => {
            switch (sortType) {
              case WinnersSortType.WINS:
                return orderType === WinnersOrderType.ASC ? a.wins - b.wins : b.wins - a.wins;
              case WinnersSortType.TIME:
                return orderType === WinnersOrderType.ASC ? a.time - b.time : b.time - a.time;
              default:
                if (orderType === WinnersOrderType.ASC) {
                  return a.name < b.name ? -1 : 1;
                } else {
                  return a.name > b.name ? -1 : 1;
                }
            }
          })
          .map((item) => {
            return (
              <tr key={item.id} className="text-center">
                <td className="border bg-white px-8 py-4">{item.name}</td>
                <td className="w-28 border bg-white">
                  <CarView color={item.color} className="flex justify-center"></CarView>
                </td>
                <td className="w-28 border bg-white">{item.wins}</td>
                <td className="border bg-white">{(item.time / 1000).toFixed(3)}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
