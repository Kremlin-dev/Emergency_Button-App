"use client";

import React, { useState } from "react";
import Text from "../atom/Text";
import Media from "../atom/Media";
import { MdEmergency, MdAnalytics, MdPeople } from "react-icons/md";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Media text="Employees" link="employees">
            <MdPeople size={24} />
          </Media>
        </div>

        <div className="hidden md:flex items-center space-x-2 cursor-pointer">
          <FaUser size={24} />
          <Text>Isaac Amponsah</Text>
        </div>

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
          <Media text="Employees" link="employees">
            <MdPeople size={24} />
          </Media>
          <div className="flex items-center space-x-2 cursor-pointer text-white hover:text-blue-400 transition-colors duration-200">
            <FaUser size={24} />
            <Text>Isaac Amponsah</Text>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
