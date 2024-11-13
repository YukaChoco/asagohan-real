import supabase from "@/app/supabase";

const getPublicBucketURL = async (bucketsName: string) => {
  const publicURLResponseData = await supabase.storage
    .from(bucketsName)
    .getPublicUrl("");
  const publicURL = publicURLResponseData.data.publicUrl || "";
  return publicURL;
};

export default getPublicBucketURL;
