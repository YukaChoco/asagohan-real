"use client";
import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { MORNING_POST_END, MORNING_POST_START } from "@/app/const";

const usePostAsagohan = (userID: string | null) => {
  const [sending, setSending] = useState<boolean>(false);
  const [canSend, setCanSend] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const postAsagohan = async (title: string, image: File) => {
    if (!userID) {
      setError("ログインしていないユーザが投稿を行おうとしました");
      throw new Error("ログインしていないユーザが投稿を行おうとしました");
    }

    setSending(true);
    const res = await fetch(`/api/asagohan/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        userID,
      }),
    });

    if (!res.ok) {
      const responseData = await res.json(); // JSONレスポンスを取得
      setError(responseData.error || res.statusText); // エラーメッセージをセット
      setSending(false);
      return;
    }

    const responseData = await res.json();

    const { createdIDs } = responseData; // createdIDを取り出す

    if (!createdIDs) {
      setError("createdIDが取得できませんでした");
      setSending(false);
      return;
    }

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
      const responseData = await resImagePost.json(); // JSONレスポンスを取得
      setError(responseData.error || resImagePost.statusText); // エラーメッセージをセット
      setSending(false);
      return;
    }

    window.location.href = "/";
  };

  const retryPostAsagohan = async (title: string, image: File) => {
    setSending(true);
    setError(null);
    await postAsagohan(title, image);
  };

  useEffect(() => {
    if (!userID) {
      return;
    }
    setSending(true);

    // MORNING_POST_START時からMORNING_POST_END時までしか朝ごはんを登録できない
    const nowDate = toZonedTime(new Date(), "Asia/Tokyo");
    if (
      nowDate.getHours() < MORNING_POST_START ||
      nowDate.getHours() >= MORNING_POST_END
    ) {
      setCanSend(
        `朝ごはんは${MORNING_POST_START}時から${MORNING_POST_END}時までしか登録できません。`,
      );
    }

    // 1日1回しか投稿できない
    const fetchAsagohans = async () => {
      const canSendResponse = await fetch(`/api/asagohan/canSend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }),
      });
      console.log(canSendResponse);
      if (!canSendResponse.ok) {
        const responseData = await canSendResponse.json(); // JSONレスポンスを取得
        setCanSend(responseData.error || canSendResponse.statusText); // エラーメッセージをセット
        setSending(false);
        return;
      }

      setSending(false);
    };

    fetchAsagohans();
  }, [userID]);

  return {
    postAsagohan,
    asagohanSending: sending,
    canSend,
    error,
    retryPostAsagohan,
  };
};

export default usePostAsagohan;
