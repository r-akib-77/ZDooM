import React from "react";
import { useThemeStore } from "../store/useThemeStore";
import { PaletteIcon, PanelLeftIcon, ThermometerIcon } from "lucide-react";
import { THEMES } from "../constants/Const";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      {/* dropwdown trigger  */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 shadow-2xl  p-1 bg-base-200 backdrop-blur-lg rounded-2xl w-56 border-base-content/10 border overflow-y-auto max-h-80 "
      >
        <div className="space-y-1 ">
          {THEMES.map((t) => (
            <button
              key={t.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center transition-colors gap-3  ${
                theme === t.name
                  ? "bg-primary/10 text-primary  "
                  : "hover:bg-base-content/5"
              }`}
              onClick={() => setTheme(t.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="text-sm font-medium ">{t.label}</span>

              {/* theme preview colors  */}
              <div className="ml-auto flex gap-1">
                {t.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="size-2 rounded-full "
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
