"use client";

import React from "react";

export default function SiteFooter() {
  return (
    <footer className="fixed bottom-8 mx-auto w-full max-w-(--breakpoint-md) md:max-w-(--breakpoint-2xl) lg:max-w-full">
      <ul className="flex flex-wrap justify-center gap-4 text-center text-xs">
        <li>
          <a href="#" className="text-gray-500 transition hover:opacity-75">
            © 2023
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-500 transition hover:opacity-75">
            Threads Terms
          </a>
        </li>

        <li>
          <a href="#" className="text-gray-500 transition hover:opacity-75">
            Privacy Policy
          </a>
        </li>

        <li>
          <a href="#" className="text-gray-500 transition hover:opacity-75">
            Cookies Policy
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-500 transition hover:opacity-75">
            Report a problem
          </a>
        </li>
      </ul>
    </footer>
  );
}
