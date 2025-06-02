export async function revalidateFromClientByTag(tags: string[]) {
  const res = await fetch("/api/revalidateByTag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tags }),
  });

  const result = await res.json();
  if (!result.revalidated) {
    console.error("Revalidation failed");
  }
}
