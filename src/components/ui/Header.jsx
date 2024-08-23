import React from "react";
import { FiLogOut } from "react-icons/fi"; // Importing an icon from react-icons
import logo from "../assets/Nervotec_logo.png";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container w-full px-4 py-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-x-5">
            <img
              src="https://i.pravatar.cc/300"
              alt="User Avatar"
              className="object-cover w-10 h-10 rounded-full"
            />
            <span className="font-bold">Demo User</span>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="logo"
              className="object-cover sm:w-[150px] h-[23px]"
            />
          </div>
          <div className="flex items-center justify-end">
            <button className="flex items-center text-gray-500 gap-x-2 hover:text-gray-700">
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
