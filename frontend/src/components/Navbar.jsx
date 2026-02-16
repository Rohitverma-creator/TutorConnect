import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRegWindowClose } from "react-icons/fa";

const Navbar = ({ containerStyles = "", toggleMenu, menuOpened }) => {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/tutor", label: "Tutors" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={containerStyles}>
      {menuOpened && (
        <>
          {/* Close */}
          <FaRegWindowClose
            onClick={toggleMenu}
            className="text-xl self-end cursor-pointer"
          />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-xl font-bold">
            <span className="inline-flex items-center justify-center h-8 w-8 bg-secondary text-tertiary -rotate-[30deg] rounded-full">
              T
            </span>
            <span>Tutor Connect</span>
          </Link>
        </>
      )}

      {navItems.map(({ to, label }) => (
        <NavLink
          key={label}
          to={to}
          end={to === "/"}
          onClick={toggleMenu}
          className={({ isActive }) =>
            isActive
              ? "active-link medium-16"
              : "text-white medium-16"
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
