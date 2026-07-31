export async function getCalls() {
  const res = await fetch("/api/calls");

  if (!res.ok) {
    throw new Error("Failed to fetch calls");
  }
  return res.json();
}
