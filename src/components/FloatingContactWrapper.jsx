"use client";
import { usePathname } from "next/navigation";
import FloatingContact from "./FloatingContact";

export default function FloatingContactWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;
  return <FloatingContact />;
}
