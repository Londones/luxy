"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/global/mode-toggle";

const Navigation = () => {
  const { user } = useUser();
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image src="/assets/plura-logo.svg" width={40} height={40} alt="Logo" />
        <span className="text-xl font-bold">Luxy.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transfrom translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href="#">Pricing</Link>
          <Link href="#">About</Link>
          <Link href="#">Documentation</Link>
          <Link href="#">Feature</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {user ? (
          <>
            <Link
              href="/profile"
              className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/50"
            >
              Profile
            </Link>
            <UserButton />
          </>
        ) : (
          <Link
            href="/profile"
            className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/50"
          >
            Login
          </Link>
        )}
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
