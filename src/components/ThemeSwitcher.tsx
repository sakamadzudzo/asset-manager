import { MoonIcon, SunIcon } from "@phosphor-icons/react";

export function ThemeSwitcher({
  saveDarkMode,
  darkMode,
}: {
  saveDarkMode: (darkMode: boolean) => void;
  darkMode: boolean;
}) {
  return (
    <div
      className="absolute right-3 bottom-3 z-50 border border-foreground bg-background cursor-pointer rounded-xl overflow-hidden p-1"
      onClick={() => saveDarkMode(!darkMode)}
    >
      {darkMode ? (
        <MoonIcon weight="thin" size={30} />
      ) : (
        <SunIcon weight="thin" size={30} />
      )}
    </div>
  );
}
