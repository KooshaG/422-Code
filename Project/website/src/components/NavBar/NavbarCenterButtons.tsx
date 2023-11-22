"use client";

import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/trpc/client";

type Props = {
  session?: Session | null
}

const navLinks = [
  {
    nav: "/doorbells",
    name: "Your Doorbells",
  }, 
  {
    nav: "/add",
    name: "Add Doorbell",
  },
  {
    nav: "/test",
    name: "Test",
  }, 
];

export default function NavbarCenterButtons({session}: Props) {
  const pathname = usePathname();
  const { data } = useSession();
  const utils = api.useUtils();
  if (session === undefined) {
    session = data;
  }



  return (
  <div className="navbar-center">
    {
    session && 
    <div className="tabs hidden md:block">
      {navLinks.map(link => {
        return (
        <Link key={link.nav} href={link.nav} onClick={() => utils.invalidate()} className={`tab md:tab-md lg:tab-lg tab-lifted ${pathname.startsWith(link.nav) ? "tab-active" : ""}`}>
          {link.name}
        </Link>
        );
      })}
    </div>
    }
  </div>
  );
}
