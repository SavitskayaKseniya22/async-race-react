"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2">
      <Link href="/" className={`btn ${pathname === "/" ? "btn_disabled" : ""}`}>
        to garage
      </Link>
      <Link href="/winners" className={`btn ${pathname === "/winners" ? "btn_disabled" : ""}`}>
        to winners
      </Link>
    </nav>
  );
}
