import { useQuery } from "@tanstack/react-query";

async function fetchMessages(chatId: string) {
  const res = await fetch(`/api/messages/${chatId}`);
  const result = await res.json();
  return result;
}

export function useMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => fetchMessages(chatId as string),
    enabled: !!chatId,
  });
}
