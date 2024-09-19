import supabase from "@/app/supabase";

export async function POST(
  request: Request,
  { params }: { params: { asagohanID: string } }
) {
  const asagohanID = params.asagohanID;
  console.log(asagohanID);
  const { userID } = await request.json();
  console.log(userID);

  const { error } = await supabase
    .from("likes")
    .insert({ asagohan_id: asagohanID, user_id: userID });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Liked successfully!" }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { asagohanID: string } }
) {
  const { asagohanID } = params;
  const { userID } = await request.json();

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("asagohan_id", asagohanID)
    .eq("user_id", userID);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Unliked successfully!" }, { status: 200 });
}
