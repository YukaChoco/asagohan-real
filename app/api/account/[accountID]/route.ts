import supabase from "@/app/supabase";
import type { UserProfile } from "@/app/types/User";
import getAsagohanImagePath from "@/app/utils/getAsagohanImagePath";
import getPublicBucketURL from "@/app/utils/getPublicUserIconURL";
import getUserIconPath from "@/app/utils/getUserIconPath";

interface UserResponse {
  id: string;
  name: string;
  account_id: string;
  asagohans: {
    id: string;
    created_at: string;
    likes: {
      user_id: string;
    }[];
  }[];
}

export async function GET(
  request: Request,
  { params }: { params: { accountID: string } },
) {
  const accountID = params.accountID;
  const { dateString } = await request.json();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      account_id,
      asagohans (id, created_at, likes (user_id))
      `,
    )
    .eq("account_id", accountID)
    .single<UserResponse>();

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

  const asagohans = data.asagohans;

  const thisWeekAsagohans = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 6);

    date.setDate(date.getDate() + i - 6);
    const targetAsagohan = asagohans.find(
      (asagohan) => new Date(asagohan.created_at).getDate() === date.getDate(),
    );
    return targetAsagohan
      ? {
          id: targetAsagohan.id,
          created_at: targetAsagohan.created_at,
        }
      : { id: "0", created_at: date.toISOString() };
  });

  const bestAsagohan =
    asagohans.length > 0
      ? asagohans.reduce(
          (best, asagohan) => {
            if (asagohan.likes.length > best.likes) {
              return {
                id: asagohan.id,
                likes: asagohan.likes.length,
              };
            }
            return best;
          },
          { id: asagohans[0].id, likes: asagohans[0].likes.length },
        )
      : null;
  const bestAsagohanID = bestAsagohan ? bestAsagohan.id : "0";

  const publicAsagohanURL = await getPublicBucketURL("asagohans");
  const publicUserIconsURL = await getPublicBucketURL("user_icons");

  const formatCreatedAtDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const user: UserProfile = {
    id: data.id,
    name: data.name,
    accountID: data.account_id,
    userIconPath: getUserIconPath(publicUserIconsURL, data.id),
    bestAsagohan: {
      id: bestAsagohanID,
      imagePath: getAsagohanImagePath(publicAsagohanURL, bestAsagohanID),
    },
    thisWeekAsagohans: thisWeekAsagohans.map((asagohan) => ({
      createdAt: formatCreatedAtDate(asagohan.created_at),
      imagePath: getAsagohanImagePath(publicAsagohanURL, asagohan.id),
    })),
  };
  return Response.json({ data: user });
}
