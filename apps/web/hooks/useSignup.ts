import { useMutation } from "@tanstack/react-query";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

async function signupUser(data: SignupData) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Signup Failed");
  }
  return result;
}

export function useSignUp() {
  return useMutation({
    mutationFn: signupUser,
  });
}
