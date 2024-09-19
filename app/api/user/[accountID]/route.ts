import supabase from "@/app/supabase";
import type { UserProfile } from "@/app/types/User";

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
  _: Request,
  { params }: { params: { accountID: string } }
) {
  const accountID = params.accountID;

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      account_id,
      asagohans (id, created_at, likes (user_id))
      `
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
    const date = new Date();
    date.setDate(date.getDate() + i - 7);
    const targetAsagohan = asagohans.find(
      (asagohan) => new Date(asagohan.created_at).getDate() === date.getDate()
    );
    return targetAsagohan
      ? {
          id: targetAsagohan.id,
          created_at: targetAsagohan.created_at,
        }
      : { id: "0", created_at: date.toISOString() };
  });

  const bestAsagohan = asagohans.reduce(
    (best, asagohan) => {
      if (asagohan.likes.length > best.likes) {
        return {
          id: asagohan.id,
          likes: asagohan.likes.length,
        };
      }
      return best;
    },
    { id: "0", likes: 0 }
  );

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
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const removeHyphen = (id: string) => id.replace(/-/g, "");

  const user: UserProfile = {
    id: data.id,
    name: data.name,
    accountID: data.account_id,
    userIconPath: `${publicUserIconURL}${removeHyphen(data.id)}.png`,
    bestAsagohan: {
      id: bestAsagohan.id,
      imagePath: `${publicAsagohanURL}${bestAsagohan.id}.png`,
    },
    thisWeekAsagohans: thisWeekAsagohans.map((asagohan) => ({
      createdAt: formatCreatedAtDate(asagohan.created_at),
      imagePath: `${publicAsagohanURL}${asagohan.id}.png`,
    })),
  };
  return Response.json({ data: user });
}
