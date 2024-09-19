import supabase from "@/app/supabase";

export async function PUT(
  request: Request,
  { params }: { params: { accountID: string } }
) {
  const accountID = params.accountID;
  const { name } = await request.json();

  const { error } = await supabase
    .from("users")
    .update({ name })
    .eq("account_id", accountID);

  if (error) {
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }

  return new Response("OK", {
    status: 200,
  });
}
