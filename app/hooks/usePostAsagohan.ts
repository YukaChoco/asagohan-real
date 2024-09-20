"use client";
import { useState } from "react";
import supabase from "../supabase";

const usePostAsagohan = (userID: string) => {
  const [sending, setSending] = useState(false);

  const postAsagohan = async (title: string, image: File) => {
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
    console.log(responseData); // レスポンス全体を確認

    const { createdIDs } = responseData; // createdIDを取り出す
    const createdID = createdIDs[0].id; // created
    console.log(createdID); // createdIDを表示

    const { error } = await supabase.storage
      .from("asagohans")
      .upload(`${createdID}.png`, image);
    if (error) {
      throw new Error("Failed to update user icon");
    }

    setSending(false);
  };

  return { postAsagohan, asagohanSending: sending };
};

export default usePostAsagohan;
