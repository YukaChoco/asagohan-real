const sendComment = async (
  userID: string,
  asagohanID: string,
  comment: string,
) => {
  console.log(userID, asagohanID, comment);

  //   // コメントを送信するためのAPIを叩く(以下、fetchの使い方)
  //   await fetch("/api/asagohan/comment", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userID, asagohanID, comment }),
  //   })
  //     // 成功した場合はコンソールに成功メッセージを表示
  //     .then((res) => {
  //       if (!res.ok) {
  //         console.error("Failed to send comment");
  //       }
  //     })
  //     // 失敗した場合はエラーメッセージを表示
  //     .catch((error) => {
  //       console.error(error);
  //     });

  return;
};

export default sendComment;
