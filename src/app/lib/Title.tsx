"use client";

import { usePathname } from "next/navigation";

export default function Title() {
  const pathname = usePathname();
  return <h2 className="text-2xl italic">{pathname === "winners" ? "winners" : "garage"}</h2>;
}
