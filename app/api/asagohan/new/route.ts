import { MORNING_POST_END, MORNING_POST_START } from "@/app/const";
import supabase from "@/app/supabase";
import { toZonedTime } from "date-fns-tz";

export async function POST(request: Request) {
  const { userID, title } = await request.json();

  const nowDate = toZonedTime(new Date(), "Asia/Tokyo");

  // MORNING_POST_START時からMORNING_POST_END時までしか朝ごはんを登録できない
  if (
    nowDate.getHours() < MORNING_POST_START ||
    nowDate.getHours() >= MORNING_POST_END
  ) {
    return Response.json(
      {
        error: `${MORNING_POST_START}時から${MORNING_POST_END}時までしか投稿できません。`,
      },
      { status: 400 },
    );
  }

  // 一回の投稿は1日1回まで
  const { data: asagohans, error: asagohanError } = await supabase
    .from("asagohans")
    .select("created_at")
    .eq("user_id", userID)
    .order("created_at", { ascending: false });

  if (asagohanError) {
    return Response.json({ error: asagohanError.message }, { status: 500 });
  }

  if (asagohans.length > 0) {
    const lastAsagohanDate = new Date(asagohans[0].created_at);

    if (
      nowDate.getFullYear() === lastAsagohanDate.getFullYear() &&
      nowDate.getMonth() === lastAsagohanDate.getMonth() &&
      nowDate.getDate() === lastAsagohanDate.getDate()
    ) {
      return Response.json(
        { error: "1日1回しか投稿できません。" },
        { status: 400 },
      );
    }
  }

  const { data, error } = await supabase
    .from("asagohans")
    .insert({
      created_at: nowDate,
      user_id: userID,
      title: title,
    })
    .select("id")
    .returns<string>();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(
    { message: "Created successfully!", createdIDs: data },
    { status: 201 },
  );
}
