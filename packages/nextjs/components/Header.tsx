"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowKitCustomConnectButton2 } from "./scaffold-nft/RainbowKitCustomConnectButton2";
// import { useChainId } from "wagmi";
import {
  Bars3Icon,
  BeakerIcon,
  BugAntIcon, //, CogIcon
} from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  // {
  //   label: "Metadata Upload",
  //   href: "/nft-storage",
  //   icon: <CogIcon className="h-4 w-4" />,
  // },
];

type Props = {
  menuLinks: HeaderMenuLink[];
};

export const HeaderMenuLinks = ({ menuLinks }: Props) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [instancedHeaderLinks, setInstancedHeaderLinks] = useState(menuLinks);

  // const chainId = useChainId();

  useEffect(() => {
    if (location?.hostname === "localhost" || location?.hostname === "127.0.0.1") {
      setInstancedHeaderLinks([
        ...instancedHeaderLinks,
        {
          label: "Testing Grounds",
          href: "/testing-grounds",
          icon: <BeakerIcon className="h-4 w-4" />,
        },
        {
          label: "Debug Contracts",
          href: "/debug",
          icon: <BugAntIcon className="h-4 w-4" />,
        },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  // const [output, setOutput] = useState<any>();

  let output;

  const pathname = usePathname();
  if (pathname !== "/") {
    output = (
      <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
        <div className="navbar-start w-auto lg:w-1/2">
          <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
              onClick={() => {
                setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
              }}
            >
              <Bars3Icon className="h-1/2" />
            </label>
            {isDrawerOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                <HeaderMenuLinks menuLinks={instancedHeaderLinks} />
              </ul>
            )}
          </div>
          <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
            <div className="flex relative w-10 h-10">
              <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-tight">Ladders.Vision</span>
              <span className="text-xs">NFT dev stack</span>
            </div>
          </Link>
          <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
            <HeaderMenuLinks menuLinks={instancedHeaderLinks} />
          </ul>
        </div>
        <div className="navbar-end flex-grow mr-4">
          <RainbowKitCustomConnectButton2 />
          {/*<FaucetButton /> */}
        </div>
      </div>
    );
  }

  return <>{output}</>;
};
