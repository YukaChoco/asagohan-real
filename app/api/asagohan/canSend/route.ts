import supabase from "@/app/supabase";

interface AsagohanResponse {
  id: string;
}

export async function POST(request: Request) {
  const { userID, dateString } = await request.json();

  const date = new Date(dateString);
  const todayStartJP = date;
  todayStartJP.setHours(todayStartJP.getHours() - 6);
  todayStartJP.setHours(0, 0, 0, 0); // 今日の開始時刻 (00:00:00)

  const todayEndJP = date;
  todayEndJP.setHours(todayEndJP.getHours() - 6);
  todayEndJP.setHours(11, 59, 59, 999); // 今日の終了時刻 (11:59:59)

  const { data, error } = await supabase
    .from("asagohans")
    .select("id")
    .gte("created_at", todayStartJP.toISOString()) // 今日の開始時刻以降
    .lte("created_at", todayEndJP.toISOString()) // 今日の終了時刻以前
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