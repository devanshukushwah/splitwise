export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const a = parseInt(searchParams.get("a"), 10);
  const b = parseInt(searchParams.get("b"), 10);

  if (isNaN(a) || isNaN(b)) {
    return new Response("Invalid input", { status: 400 });
  }

  const result = a + b;
  return new Response(JSON.stringify({ result }), {
    headers: { "Content-Type": "application/json" },
  });
}
