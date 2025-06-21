import { useLocation, Link } from "react-router";
import { useAuthUser } from "../hooks/useAuthUser";
import { PiAirplaneTakeoffDuotone } from "react-icons/pi";
import { BellDotIcon, HomeIcon } from "lucide-react";

const SideBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();

  const currentRoute = location.pathname;
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300 ">
        <Link to={"/"} className="flex items-center gap-2.5 ">
          <PiAirplaneTakeoffDuotone className="size-9 " />{" "}
          <span
            className="
          text-3xl font-bold tracking-wider"
          >
            ZDoom
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/"}
          className={`btn btn-ghost w-full gap-3 px-3 normal-case justify-start ${
            currentRoute === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon
            className="size-5 opacity-70 
          text-base-content"
          />

          <span>Home</span>
        </Link>

        <Link
          to={"/notifications"}
          className={`btn btn-ghost w-full gap-3 px-3 normal-case justify-start ${
            currentRoute === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellDotIcon
            className="size-5 opacity-70 
          text-base-content"
          />

          <span>Notifications</span>
        </Link>
      </nav>

      {/* user profile section  */}
      <div className="p-4 border-base-300 border-t mt-auto ">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="rounded-full w-10">
              <img src={authUser?.profilePic} alt="userAvatar" />
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm ">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inliune-block" />
              online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
