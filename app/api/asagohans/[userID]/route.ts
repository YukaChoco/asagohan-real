import supabase from "@/app/supabase";
import type Asagohan from "@/app/types/Asagohan";
import getAsagohanImagePath from "@/app/utils/getAsagohanImagePath";
import getPublicBucketURL from "@/app/utils/getPublicUserIconURL";
import getUserIconPath from "@/app/utils/getUserIconPath";

interface AsagohanResponse {
  id: string;
  created_at: string;
  title: string;
  likes: {
    user_id: string;
  }[];
  comments: {
    created_at: string;
    content: string;
    user: {
      id: string;
      name: string;
      account_id: string;
    };
  }[];
  user: {
    id: string;
    name: string;
    account_id: string;
  };
}

export async function GET(
  _: Request,
  { params }: { params: { userID: string } },
) {
  const userID = params.userID;

  const todayStartJP = new Date();
  todayStartJP.setHours(todayStartJP.getHours() + 9);
  todayStartJP.setHours(0, 0, 0, 0); // 今日の開始時刻 (00:00:00)

  const todayEndJP = new Date();
  todayEndJP.setHours(todayEndJP.getHours() + 9);
  todayEndJP.setHours(11, 59, 59, 999); // 今日の終了時刻 (11:59:59)

  const { data, error } = await supabase
    .from("asagohans")
    .select(
      `
      *,
      likes (user_id),
      comments: comments (created_at, content, user: user_id (id, name, account_id)),
      user: user_id (id, name, account_id)
      `,
    )
    .gte("created_at", todayStartJP.toISOString()) // 今日の開始時刻以降
    .lte("created_at", todayEndJP.toISOString()) // 今日の終了時刻以前
    .returns<AsagohanResponse[]>();

  if (error) {
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }
  if (!data || data.length === 0) {
    return new Response("No data found", { status: 404 });
  }

  const publicAsagohanURL = await getPublicBucketURL("asagohans");
  const publicUserIconsURL = await getPublicBucketURL("user_icons");

  const formatCreatedAtDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}時${date.getMinutes()}分`;
  };

  // いいね数でソートし、ランキングを付ける
  const rankedData = data
    .sort(
      (a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0),
    )
    .map((asagohan, index) => ({
      ...asagohan,
      ranking: index < 3 ? index + 1 : null,
    }));

  const asagohans: Asagohan[] = rankedData.map((asagohan) => ({
    id: asagohan.id,
    createdAt: formatCreatedAtDate(asagohan.created_at),
    title: asagohan.title,
    imagePath: getAsagohanImagePath(publicAsagohanURL, asagohan.id),
    likes: asagohan.likes ? asagohan.likes.length : 0,
    isLiked: asagohan.likes
      ? asagohan.likes.some((like) => like.user_id === userID)
      : false,
    comments: asagohan.comments
      ? asagohan.comments.map((comment) => ({
          content: comment.content,
          createdAt: formatCreatedAtDate(comment.created_at),
          user: {
            id: comment.user.id,
            name: comment.user.name,
            accountID: comment.user.account_id,
            userIconPath: getUserIconPath(publicUserIconsURL, comment.user.id),
          },
        }))
      : [],
    user: {
      id: asagohan.user.id,
      name: asagohan.user.name,
      accountID: asagohan.user.account_id,
      userIconPath: getUserIconPath(publicUserIconsURL, asagohan.user.id),
    },
    ranking: asagohan.ranking,
  }));

  // 作成日時でソート
  asagohans.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  return new Response(JSON.stringify({ data: asagohans }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
