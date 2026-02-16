import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiUserLine } from "react-icons/ri";
import { CgMenuLeft } from "react-icons/cg";
import Navbar from "./Navbar";

function Header() {
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep text-white">
      <div className="max-pad-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-bold">
          <span className="inline-flex items-center justify-center h-8 w-8 bg-secondary text-tertiary -rotate-[30deg] rounded-full">
            T
          </span>
          <span>Tutor Connect</span>
        </Link>

        {/* Desktop Navbar */}
        <div className="hidden xl:block">
          <Navbar containerStyles="flex items-center gap-x-10" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <CgMenuLeft
            onClick={toggleMenu}
            className="text-2xl cursor-pointer xl:hidden"
          />

          <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            Login <RiUserLine />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpened && (
        <div className="fixed inset-0 z-40 xl:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={toggleMenu}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-screen w-[240px] bg-deep px-8 py-6 shadow-xl">
            <Navbar
              menuOpened={menuOpened}
              toggleMenu={toggleMenu}
              containerStyles="flex flex-col gap-y-8"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
