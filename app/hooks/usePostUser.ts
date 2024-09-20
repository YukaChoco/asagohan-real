"use client";
import { useState } from "react";
import supabase from "../supabase";

const usePostUser = () => {
  const [sending, setSending] = useState(false);

  const postUser = async (
    userID: string,
    name: string,
    accountID: string,
    userIcon: File
  ) => {
    setSending(true);
    const res = await fetch(`/api/user/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, name, accountID }),
    });

    if (!res.ok) {
      console.error("Failed to post user");
    }

    const removeHyphen = (id: string) => id.replace(/-/g, "");

    console.log(`${removeHyphen(userID)}.png`);
    const { error } = await supabase.storage
      .from("user_icons")
      .upload(`${removeHyphen(userID)}.png`, userIcon);
    if (error) {
      throw new Error("Failed to update user icon");
    }

    setSending(false);
  };

  return { postUser, userSending: sending };
};

export default usePostUser;
