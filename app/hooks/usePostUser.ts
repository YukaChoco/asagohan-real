"use client";
import { useState } from "react";

const usePostUser = () => {
  const [sending, setSending] = useState(false);

  const postUser = async (
    userID: string,
    name: string,
    accountID: string,
    userIcon: File,
  ) => {
    setSending(true);

    const resUserPost = await fetch(`/api/user/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        name,
        accountID,
        dateString: new Date().toISOString(),
      }),
    });

    if (!resUserPost.ok) {
      console.error("Failed to post user");
    }

    // FormDataの作成
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("userIcon", userIcon);

    const resIconPost = await fetch(`/api/account/${userID}/icon/new`, {
      method: "POST",
      body: formData,
    });

    if (!resIconPost.ok) {
      console.error("Failed to post user icon");
      throw new Error("Failed to update user icon");
    }

    setSending(false);
  };

  return { postUser, userSending: sending };
};

export default usePostUser;
