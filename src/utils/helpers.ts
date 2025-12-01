import { User } from "./types";

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const numformat = (num: number) => {
  let result = "";
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result;
};

export const formatDate = (date: Date | string, withTime: boolean = true) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const dayOfWeek = d.toLocaleDateString(undefined, { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString(undefined, { month: "long" });
  const year = d.getFullYear();

  // Get ordinal suffix
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithOrdinal = `${day}${getOrdinal(day)}`;

  // Check if time is not midnight (00:00:00)
  const hasTime =
    d.getHours() !== 0 || d.getMinutes() !== 0 || d.getSeconds() !== 0;

  const dateStr = `${dayOfWeek}, ${dayWithOrdinal} of ${month}, ${year}`;
  if (hasTime && withTime) {
    const timeStr = d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  }
  return dateStr;
};

export const getInitials = (user: User) => {
  const name: string = getUserFullname(user);
  if (!name) return "U";
  if (name.split(". ").length > 1) {
    const subname: string[] = name.split(". ");
    return subname[1]
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 5);
  }
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 5);
};

export const getUserFullname = (user: User) => {
  return !user
    ? ""
    : [user.salutation + ".", user.firstname, user.othernames, user.lastname]
        .filter(Boolean)
        .join(" ");
};
