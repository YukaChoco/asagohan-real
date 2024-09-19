import supabase from "@/app/supabase";

export async function PUT(request: Request) {
  const { newIcon, userID } = await request.json();

  const { error } = await supabase.storage
    .from("user_icons")
    .update(`${userID}.png`, newIcon, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
    });
  }

  return new Response("OK", {
    status: 200,
  });
}
