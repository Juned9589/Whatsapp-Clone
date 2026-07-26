import { useMutation } from "@tanstack/react-query";

interface CreateGroupData {
  groupName: string;
  memberIds: string[];
}

async function createGroup(data: CreateGroupData) {
  const res = await fetch("/api/chats/group", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create group");
  }
  return result;
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: createGroup,
  });
}
