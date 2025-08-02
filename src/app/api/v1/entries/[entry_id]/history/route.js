import { getHistory } from "@/lib/historyService";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { entry_id } = await params;
  const response = await getHistory(entry_id);
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});
