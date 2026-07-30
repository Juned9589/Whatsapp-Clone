import { useMutation } from "@tanstack/react-query";

async function viewStatus(statusId: string) {
  const res = await fetch(`/api/status/${statusId}/view`, {
    method: "POST",
  });

  const result = await res.json();
  return result;
}

export function useViewStatus() {
  return useMutation({
    mutationFn: viewStatus,
  });
}
