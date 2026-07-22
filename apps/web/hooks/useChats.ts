import { useQuery } from "@tanstack/react-query";

async function fetchChats() {
  const res = await fetch("/api/chats");
  const result = await res.json();
  return result;
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });
}
