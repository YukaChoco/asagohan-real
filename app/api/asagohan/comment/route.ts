import supabase from "@/app/supabase";

export async function POST(request: Request) {
  const { userID, asagohanID, comment } = await request.json();

  console.log(userID, asagohanID, comment);

  const { error } = await supabase.from("comments").insert({
    user_id: userID,
    asagohan_id: asagohanID,
    content: comment,
  });

  console.log(error);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ message: "Commented successfully!" }, { status: 201 });
}
