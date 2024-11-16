import supabase from "@/app/supabase";

export async function PUT(request: Request) {
  const formData = await request.formData();
  const userID = formData.get("userID") as string;
  const newIcon = formData.get("userIcon") as File;

  if (!newIcon) {
    return new Response("No file uploaded", { status: 400 });
  }

  try {
    // ファイルのバイナリデータを読み込む
    const arrayBuffer = await newIcon.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Supabaseのstorageにファイルをアップロード
    const { error } = await supabase.storage
      .from("user_icons")
      .update(`${userID}.png`, bytes, {
        contentType: newIcon.type,
        cacheControl: "no-cache",
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return new Response("Error processing file", { status: 500 });
  }
}
