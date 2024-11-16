"use client";
import { useEffect, useState } from "react";
import { MORNING_POST_END, MORNING_POST_START } from "@/app/const";

const usePostAsagohan = (userID: string | null) => {
  const [sending, setSending] = useState<boolean>(false);
  const [canSend, setCanSend] = useState<string | null>(null);
  console.log("client");
  console.log(new Date());

  const postAsagohan = async (title: string, image: File) => {
    if (!userID) {
      throw new Error("ログインしていないユーザが投稿を行おうとしました");
    }

    setSending(true);
    const res = await fetch(`/api/asagohan/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, userID }),
    });

    console.log(res);
    if (!res.ok) {
      console.error("Failed to post asagohan");
    }
    const responseData = await res.json();

    const { createdIDs } = responseData; // createdIDを取り出す
    const createdID = createdIDs[0].id; // created

    // FormDataの作成
    const formData = new FormData();
    formData.append("createdID", createdID);
    formData.append("asagohanImage", image);

    const resImagePost = await fetch(`/api/asagohan/image`, {
      method: "POST",
      body: formData,
    });

    if (!resImagePost.ok) {
      console.error("Failed to post user icon");
      throw new Error("Failed to update user icon");
    }

    window.location.href = "/";
  };

  useEffect(() => {
    // MORNING_POST_START時からMORNING_POST_END時までしか朝ごはんを登録できない
    const nowDate = new Date();
    nowDate.setHours(nowDate.getHours() - 6);
    if (
      nowDate.getHours() < MORNING_POST_START ||
      nowDate.getHours() >= MORNING_POST_END
    ) {
      setCanSend(
        `朝ごはんは${MORNING_POST_START}時から${MORNING_POST_END}時までしか登録できません。`,
      );
    }
    //
  }, [userID]);

  return { postAsagohan, asagohanSending: sending, canSend };
};

export default usePostAsagohan;
