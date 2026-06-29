"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLink {
  href: string | null;
  label: string;
}

interface Props {
  links: NavLink[];
}

const activeStyle = {
  textShadow: "0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287",
};

const activeClass =
  "flex items-center h-14 px-4 text-base font-bold text-white bg-[#FFEA9E]/10";
const inactiveClass =
  "flex items-center h-14 px-4 text-sm font-normal text-white/60 hover:text-white transition-colors";
const disabledClass =
  "flex items-center h-14 px-4 text-sm font-normal text-white/60 cursor-default";

export default function FooterNavLinks({ links }: Props) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap justify-center">
      {links.map(({ href, label }) => {
        if (href === null) {
          return (
            <li key={label}>
              <span className={disabledClass}>{label}</span>
            </li>
          );
        }

        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={isActive ? activeClass : inactiveClass}
              style={isActive ? activeStyle : undefined}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
