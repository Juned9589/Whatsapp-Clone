import { useQuery } from "@tanstack/react-query";

async function fetchCurrentUser() {
  const res = await fetch("/api/auth/me");
  const result = await res.json();
  return result;
}
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });
}
