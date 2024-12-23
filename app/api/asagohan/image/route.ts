import supabase from "@/app/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const createdID = formData.get("createdID") as string;
  const asagohanImage = formData.get("asagohanImage") as File;

  if (!asagohanImage) {
    return new Response("No file uploaded", { status: 400 });
  }

  try {
    // Supabaseのstorageにファイルをアップロード
    const { error } = await supabase.storage
      .from("asagohans")
      .upload(`${createdID}.png`, asagohanImage);

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
