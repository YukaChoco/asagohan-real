import supabase from "@/app/supabase";
import { toZonedTime } from "date-fns-tz";

interface AsagohanResponse {
  id: string;
}

export async function POST(request: Request) {
  const { userID } = await request.json();
  const date = toZonedTime(new Date(), "Asia/Tokyo");
  date.setHours(date.getHours() + 9);
  date.setHours(0, 0, 0, 0);
  date.setHours(date.getHours() + 9);

  const { data, error } = await supabase
    .from("asagohans")
    .select("id")
    .gte("created_at", date)
    .eq("user_id", userID)
    .returns<AsagohanResponse[]>();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (data.length > 0) {
    return Response.json(
      { error: "1日1回しか投稿できません。" },
      { status: 400 },
    );
  }

  return Response.json({ message: "Liked successfully!" }, { status: 201 });
}
