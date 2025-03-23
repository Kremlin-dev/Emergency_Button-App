"use client";

import React, { useState, useEffect } from "react";
import Text from "../atom/Text";
import Media from "../atom/Media";
import { MdEmergency, MdAnalytics, MdPeople } from "react-icons/md";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("companyCode");
    setIsAuthenticated(!!userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("companyCode");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="relative bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <Text>Logo</Text>

        <div className="hidden md:flex space-x-4">
          <Media text="Emergencies" link="emergencies">
            <MdEmergency size={24} />
          </Media>
          <Media text="Analytics" link="analytics">
            <MdAnalytics size={24} />
          </Media>
          {isAuthenticated && (
            <Media text="Employees" link="employees">
              <MdPeople size={24} />
            </Media>
          )}
        </div>

        {isAuthenticated ? (
          <button onClick={handleLogout} className="hidden md:flex items-center space-x-2 cursor-pointer">
            Logout
          </button>
        ) : (
          <Link href="/login" className="hidden md:flex items-center space-x-2 cursor-pointer">
            <button>Login</button>
          </Link>
        )}

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? "scale-y-100 opacity-100 h-auto" : "scale-y-0 opacity-0 h-0"
        } origin-top`}
      >
        <div className="mt-4 flex flex-col gap-y-1 space-y-2 rounded-md">
          <Media text="Emergencies" link="emergencies">
            <MdEmergency size={24} />
          </Media>
          <Media text="Analytics" link="analytics">
            <MdAnalytics size={24} />
          </Media>
          {isAuthenticated && (
            <Media text="Employees" link="employees">
              <MdPeople size={24} />
            </Media>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
