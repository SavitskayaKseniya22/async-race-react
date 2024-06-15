"use client";

import { usePathname } from "next/navigation";

export default function ControlPanel() {
  const pathname = usePathname();
  if (pathname === "winners") {
    return <></>;
  } else {
    return (
      <div className="absolute right-4 top-4 flex w-1/3 flex-col gap-2">
        <form className="flex gap-2">
          <input type="text" className="input grow" placeholder="Enter car name" />
          <input type="color" />
          <button type="submit" className="btn">
            Create
          </button>
        </form>

        <form className="flex gap-2">
          <input type="text" className="input grow" placeholder="Change car name" />
          <input type="color" />
          <button type="submit" className="btn">
            Update
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
            <button type="button" className="btn">
              Remove cars
            </button>
          </li>
          <li>
            <button type="button" className="btn">
              Generate cars
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
