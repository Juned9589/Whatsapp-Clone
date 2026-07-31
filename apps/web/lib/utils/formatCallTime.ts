export function formatCallTime(date: string) {
  return new Intl.DateTimeFormat("en-In", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}
