import supabase from "@/app/supabase";
import type { RankingAsagohan } from "@/app/types/Asagohan";

interface AsagohanResponse {
  id: string;
  title: string;
  likes: {
    user_id: string;
  }[];
  user: {
    id: string;
    name: string;
    account_id: string;
  };
}

export async function GET() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 今日の開始時刻 (00:00:00)

  const todayEnd = new Date();
  todayEnd.setHours(11, 59, 59, 999); // 今日の終了時刻 (11:59:59)

  const { data, error } = await supabase
    .from("asagohans")
    .select(
      `
      id,
      title,
      likes (user_id),
      user: user_id (id, name, account_id)
      `
    )
    .gte("created_at", todayStart.toISOString()) // 今日の開始時刻以降
    .lte("created_at", todayEnd.toISOString()) // 今日の終了時刻以前
    .returns<AsagohanResponse[]>();

  if (error) {
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
  if (!data) {
    return new Response("Not Found", {
      status: 404,
    });
  }
  const publicAsagohanURLresponseData = await supabase.storage
    .from("asagohans")
    .getPublicUrl("");
  const publicUserIconURLresponseData = await supabase.storage
    .from("user-icons")
    .getPublicUrl("");
  const publicAsagohanURL = publicAsagohanURLresponseData.data.publicUrl || "";
  const publicUserIconURL = publicUserIconURLresponseData.data.publicUrl || "";

  // いいね数でソート
  const sortedData = data.sort((a, b) => b.likes.length - a.likes.length);

  // 上位3位のみを取得
  const asagohans: RankingAsagohan[] = sortedData
    .slice(0, 3)
    .map((asagohan, index) => ({
      title: asagohan.title,
      imagePath: `${publicAsagohanURL}${asagohan.id}.png`,
      likes: asagohan.likes.length,
      user: {
        id: asagohan.user.id,
        name: asagohan.user.name,
        accountID: asagohan.user.account_id,
        userIconPath: `${publicUserIconURL}${asagohan.user.id}.png`,
      },
      ranking: index + 1,
    }));

  return Response.json({ data: asagohans });
}
