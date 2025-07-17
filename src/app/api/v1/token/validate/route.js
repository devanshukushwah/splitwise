import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, { params }) => {
  return new Response(
    JSON.stringify({ success: true, message: "valid token" }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
