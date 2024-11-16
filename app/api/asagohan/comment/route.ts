import supabase from "@/app/supabase";
import { toZonedTime } from "date-fns-tz";

export async function POST(request: Request) {
  const { userID, asagohanID, comment } = await request.json();

  const nowDate = toZonedTime(new Date(), "Asia/Tokyo");

  console.log(userID, asagohanID, comment);

  const { error } = await supabase.from("comments").insert({
    created_at: nowDate,
    user_id: userID,
    asagohan_id: asagohanID,
    content: comment,
  });

  console.log(error);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Commented successfully!" }, { status: 201 });
}
