import { useMutation } from "@tanstack/react-query";

interface LoginData {
  email: string;
  password: string;
}

async function loginUser(data: LoginData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login Failed");
  }
  return result;
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
