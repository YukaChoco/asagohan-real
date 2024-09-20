import supabase from "@/app/supabase";

interface UserResponse {
  id: string;
  account_id: string;
}

export async function GET(
  _: Request,
  { params }: { params: { userID: string } }
) {
  const userID = params.userID;

  const { data, error } = await supabase
    .from("users")
    .select("id, account_id")
    .eq("id", userID)
    .single<UserResponse>();
  console.log(data);

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

  return new Response(JSON.stringify(data.account_id), {
    status: 200,
  });
}
