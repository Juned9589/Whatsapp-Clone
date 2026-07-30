import { useQuery } from "@tanstack/react-query";

async function fetchStatuses() {
  const res = await fetch("/api/status");
  const result = await res.json();
  return result;
}

export function useStatuses() {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: fetchStatuses,
  });
}
