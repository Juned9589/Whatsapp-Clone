import { useMutation } from "@tanstack/react-query";
import { string } from "zod";

interface createStatusData {
  mediaUrl: string;
  caption?: string;
}

async function createStatus(data: createStatusData) {
  const res = await fetch("/api/status", {
    method: "POST",
    headers: { "Content-Type": "apllication/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create status");
  }
  return result;
}

export function useCreateStatus() {
  return useMutation({
    mutationFn: createStatus,
  });
}
