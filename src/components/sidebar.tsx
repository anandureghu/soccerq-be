"use client";
import { BiHomeAlt2 } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";
import { GiSoccerKick } from "react-icons/gi";
import { IoStatsChart } from "react-icons/io5";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    id: "",
    label: "Home",
    href: "/",
    icon: BiHomeAlt2,
  },
  {
    id: "team",
    label: "Team",
    href: "/team",
    icon: AiOutlineTeam,
  },
  {
    id: "matches",
    label: "Matches",
    href: "/matches",
    icon: GiSoccerKick,
  },

  {
    id: "stats",
    label: "Stats",
    href: "/stats",
    icon: IoStatsChart,
  },
];

const Sidebar = () => {
  const [selected, setSelected] = useState(navItems[0].label);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setSelected(pathName === "/" ? "" : pathName.split("/")[1]);
  }, [pathName]);

  return (
    <div className="fixed bottom-[20px] left-1/2 transform -translate-x-1/2 bg-gray-900 flex items-center gap-2 p-[5px] rounded-full">
      {navItems.map((item) => (
        <div
          key={item.label}
          onClick={() => {
            setSelected(item.id);
            router.push(item.href);
          }}
          className={`flex items-center gap-2 cursor-pointer text-white font-semibold ${
            selected === item.id ? "bg-blue-600" : ""
          } px-4 py-2 rounded-full transition-colors duration-200`}
        >
          <item.icon className="" size={24} />
          {item.id === selected.toLowerCase() && <span>{item.label}</span>}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
