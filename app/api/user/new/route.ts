import supabase from "@/app/supabase";

export async function POST(request: Request) {
  const { userID, name, accountID } = await request.json();

  const { error } = await supabase.from("users").insert({
    id: userID,
    name: name,
    account_id: accountID,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Created successfully!" }, { status: 201 });
}
