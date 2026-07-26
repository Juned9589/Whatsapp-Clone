import { useQuery } from "@tanstack/react-query";

async function fetchUsers() {
  const res = await fetch("/api/users");
  const result = await res.json();
  return result;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
