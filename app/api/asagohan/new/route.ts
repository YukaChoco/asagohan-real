import supabase from "@/app/supabase";

export async function POST(request: Request) {
  const { userID, title } = await request.json();

  const { data, error } = await supabase
    .from("asagohans")
    .insert({
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
    { status: 201 }
  );
}
