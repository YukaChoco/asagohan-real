import supabase from "@/app/supabase";
import { toZonedTime } from "date-fns-tz";
import type { RankingAsagohan } from "@/app/types/Asagohan";
import getAsagohanImagePath from "@/app/utils/getAsagohanImagePath";
import getPublicBucketURL from "@/app/utils/getPublicUserIconURL";
import getUserIconPath from "@/app/utils/getUserIconPath";

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

export async function GET(_: Request) {
  // 今日投稿された朝ごはんのみを取得
  const date = toZonedTime(new Date(), "Asia/Tokyo");
  date.setHours(date.getHours() + 9);

  const { data, error } = await supabase
    .from("asagohans")
    .select(
      `
      id,
      title,
      likes (user_id),
      user: user_id (id, name, account_id)
      `,
    )
    .gte("created_at", date.setHours(0, 0, 0, 0))
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

  const publicAsagohanURL = await getPublicBucketURL("asagohans");
  const publicUserIconsURL = await getPublicBucketURL("user_icons");

  // いいね数でソート
  const sortedData = data.sort((a, b) => b.likes.length - a.likes.length);

  // 上位3位のみを取得
  const asagohans: RankingAsagohan[] = sortedData
    .slice(0, 3)
    .map((asagohan, index) => ({
      title: asagohan.title,
      imagePath: getAsagohanImagePath(publicAsagohanURL, asagohan.id),
      likes: asagohan.likes.length,
      user: {
        id: asagohan.user.id,
        name: asagohan.user.name,
        accountID: asagohan.user.account_id,
        userIconPath: getUserIconPath(publicUserIconsURL, asagohan.user.id),
      },
      ranking: index + 1,
    }));

  return Response.json({ data: asagohans });
}
