import { useState } from "react";

const useSendComment = (refetchAsagohans: () => Promise<void>) => {
  const [sending, setSending] = useState(false);

  const sendComment = async (
    userID: string,
    asagohanID: string,
    comment: string,
  ) => {
    setSending(true);
    // コメントを送信するためのAPIを叩く(以下、fetchの使い方)
    await fetch("/api/asagohan/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        asagohanID,
        comment,
      }),
    })
      // 成功した場合はコンソールに成功メッセージを表示
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to send comment");
        }
      })
      // 失敗した場合はエラーメッセージを表示
      .catch((error) => {
        console.error(error);
      })
      .finally(async () => {
        await refetchAsagohans();
        setSending(false);
      });

    return;
  };

  return { sendComment, sending };
};

export default useSendComment;
