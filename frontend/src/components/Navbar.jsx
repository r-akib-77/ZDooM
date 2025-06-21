import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router";
import { useAuthUser } from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PiAirplaneTakeoffDuotone } from "react-icons/pi";
import {
  BellDotIcon,
  LogOutIcon,
  HomeIcon,
  ChevronDownIcon,
} from "lucide-react";
import { logout } from "../lib/api";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center ">
      <div className="container mx-auto px-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-end w-full">
          {/* logo  */}
          {isChatPage && (
            <div className="pl-5">
              <Link to={"/"} className="flex items-center gap-2.5 ">
                <PiAirplaneTakeoffDuotone className="size-9 " />
                <span className="text-3xl font-bold font-mono tracking-wider"></span>
              </Link>
            </div>
          )}

          {/* Mobile dropdown menu */}
          <div className="relative block sm:hidden">
            <button
              className="btn btn-ghost flex items-center gap-2"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <ChevronDownIcon className="size-5" />
              Menu
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded shadow-lg z-50">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-base-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <HomeIcon className="size-5 opacity-70 text-base-content" />
                  Home
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-base-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <BellDotIcon className="size-5 opacity-70 text-base-content" />
                  Notifications
                </Link>
              </div>
            )}
          </div>

          {/* Desktop menu (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/" className="btn btn-ghost">
              <HomeIcon className="size-5 opacity-70 text-base-content mr-1" />
              Home
            </Link>
            <Link to="/notifications" className="btn btn-ghost">
              <BellDotIcon className="size-5 opacity-70 text-base-content mr-1" />
              Notifications
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle ">
                <BellDotIcon className="h-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>
          {/* theme ThemeToggle */}
          <ThemeToggle />

          <div className="avatar">
            <div className="w-9 rounded-full ">
              <img src={authUser?.profilePic} alt="user avatar " />
            </div>
          </div>
          {/* log out button  */}
          <button
            className="btn btn-ghost btn-circle "
            onClick={() => logoutMutate()}
          >
            <LogOutIcon className="h-6 text-base-content opacity-70 " />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
