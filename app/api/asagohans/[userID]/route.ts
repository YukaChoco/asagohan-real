import supabase from "@/app/supabase";
import type Asagohan from "@/app/types/Asagohan";

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
  { params }: { params: { userID: string } }
) {
  const userID = params.userID;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 今日の開始時刻 (00:00:00)

  const todayEnd = new Date();
  todayEnd.setHours(11, 59, 59, 999); // 今日の終了時刻 (11:59:59)

  const { data, error } = await supabase
    .from("asagohans")
    .select(
      `
      id,
      created_at,
      title,
      likes (user_id),
      comments (created_at, content, user: user_id (id, name, account_id)),
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
    .from("user_icons")
    .getPublicUrl("");
  const publicAsagohanURL = publicAsagohanURLresponseData.data.publicUrl || "";
  const publicUserIconURL = publicUserIconURLresponseData.data.publicUrl || "";

  const formatCreatedAtDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}時${date.getMinutes()}分`;
  };

  // いいね数でソート
  const sortedData = data.sort((a, b) => b.likes.length - a.likes.length);

  // ランキングを付ける
  const rankedData = sortedData.map((asagohan, index) => {
    if (index < 3) {
      return { ...asagohan, ranking: index + 1 };
    } else {
      return { ...asagohan, ranking: null };
    }
  });

  const removeHyphen = (id: string) => id.replace(/-/g, "");

  const asagohans: Asagohan[] = data.map((asagohan) => ({
    id: asagohan.id,
    createdAt: formatCreatedAtDate(asagohan.created_at),
    title: asagohan.title,
    imagePath: `${publicAsagohanURL}${asagohan.id}.png`,
    likes: asagohan.likes.length,
    isLiked: asagohan.likes.some((like) => like.user_id === userID),
    comments: asagohan.comments.map((comment) => ({
      content: comment.content,
      createdAt: formatCreatedAtDate(comment.created_at),
      user: {
        id: comment.user.id,
        name: comment.user.name,
        accountID: comment.user.account_id,
        userIconPath: `${publicUserIconURL}${removeHyphen(
          comment.user.id
        )}.png`,
      },
    })),
    user: {
      id: asagohan.user.id,
      name: asagohan.user.name,
      accountID: asagohan.user.account_id,
      userIconPath: `${publicUserIconURL}${removeHyphen(asagohan.user.id)}.png`,
    },
    ranking:
      rankedData.find((ranked) => ranked.id === asagohan.id)?.ranking || null,
  }));

  asagohans.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  });

  return Response.json({ data: asagohans });
}
