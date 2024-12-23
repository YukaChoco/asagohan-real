"use client";
import styles from "./page.module.css";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import useTodayAsagohans from "@/app/hooks/useTodayAsagohans";
import { Avatar } from "@mui/material";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Asagohan from "./types/Asagohan";
import useUserAuth from "./hooks/useUserAuth";
import { useState } from "react";
import Loading from "./components/Loading";
import NoAuthenticatedModal from "./components/NoAuthenticatedModal";
import useSendComment from "./hooks/useSendComment";
import useFCM from "./hooks/useFCM";
import { useRouter } from "next/navigation";

export default function Home() {
  const {} = useFCM();
  const router = useRouter();
  const { userID, accountID, authLoading } = useUserAuth();
  const { asagohans, todayAsagohansFetching, onClickLike, refetchAsagohans } =
    useTodayAsagohans(userID, authLoading);
  const [selectedAsagohan, setSelectedAsagohan] = useState<Asagohan | null>(
    null,
  );

  const [currentComment, setCurrentComment] = useState<string>("");

  const { sendComment, sending: commentSending } =
    useSendComment(refetchAsagohans);

  useEffect(() => {
    if (!userID || !asagohans) {
      return;
    }
    // パラメーターを取得
    const url = new URL(window.location.href);
    const selectedID = url.searchParams.get("selectedID");
    console.log("selectedID", selectedID);
    if (selectedID) {
      const selected = asagohans.find(
        (asagohan) => `${asagohan.id}` === selectedID,
      );
      console.log("asagohans", asagohans);
      console.log("selected", selected);
      if (selected) {
        setSelectedAsagohan(selected);
      }
      // パラメータを削除
      router.replace("/");
    }
  }, [asagohans]);

  if (authLoading || todayAsagohansFetching) {
    return <Loading />;
  }

  if (!asagohans || asagohans.length === 0) {
    return (
      <div className={styles.page}>
        <Header>
          <div
            className={styles.first}
            onClick={() => window.location.reload()}
          >
            <Image
              className={styles.aikon}
              src="ロゴアイコン.svg"
              alt="ロゴアイコン画像"
              width={60}
              height={60}
            />
            <h1 className={styles.h1} onClick={() => window.location.reload()}>
              起きろ!
              <br />
              朝ごはんReal.
            </h1>
          </div>
          <div className={styles.next}>
            <Link href={"/camera"}>
              <Image
                className={styles.camera}
                src="投稿カメラ.svg"
                alt="投稿カメラ画像"
                width={50}
                height={50}
              />
            </Link>
            <Link href={"/ranking"}>
              <Image
                className={styles.ranking}
                src="ランキング画像.svg"
                alt="ランキング画像"
                width={50}
                height={50}
              />
            </Link>
            <Link href={`user/${accountID}`}>
              <Image
                className={styles.profile}
                src="プロフィール画像.svg"
                alt="プロフィール画像"
                width={50}
                height={50}
              />
            </Link>
          </div>
        </Header>
        <NoAuthenticatedModal />
        <main
          style={{ justifyContent: "center" }}
          className={styles.notAsagohan}
        >
          誰もまだ朝ごはんを投稿していません
        </main>
      </div>
    );
  }

  const handleClick = (asagohan: Asagohan) => {
    onClickLike(asagohan);
  };

  const handleSend = async (asagohan: Asagohan | null, comment: string) => {
    if (asagohan !== null) {
      if (userID !== null) {
        await sendComment(userID, asagohan.id, comment);
        // parametorにselectedAsagohanを渡す
        router.push(
          `/${selectedAsagohan ? `?selectedID=${selectedAsagohan.id}` : ""}`,
        );
      }
    }
  };

  const drawerIsOpen = selectedAsagohan !== null;

  return (
    <div className={styles.page}>
      <Header>
        <div className={styles.first} onClick={() => window.location.reload()}>
          <Image
            className={styles.aikon}
            src="ロゴアイコン.svg"
            alt="ロゴアイコン画像"
            width={60}
            height={60}
          />
          <h1 className={styles.h1} onClick={() => window.location.reload()}>
            起きろ!
            <br />
            朝ごはんReal.
          </h1>
        </div>
        <div className={styles.next}>
          <Link href={"/camera"}>
            <Image
              className={styles.camera}
              src="投稿カメラ.svg"
              alt="投稿カメラ画像"
              width={50}
              height={50}
            />
          </Link>
          <Link href={"/ranking"}>
            <Image
              className={styles.ranking}
              src="ランキング画像.svg"
              alt="ランキング画像"
              width={50}
              height={50}
            />
          </Link>
          <Link href={`user/${accountID}`}>
            <Image
              className={styles.profile}
              src="プロフィール画像.svg"
              alt="プロフィール画像"
              width={50}
              height={50}
            />
          </Link>
        </div>
      </Header>
      <main className={styles.main}>
        <Drawer
          sx={{ width: "100dvw" }}
          anchor="bottom"
          open={drawerIsOpen}
          onClose={() => setSelectedAsagohan(null)}
        >
          <div className={styles.drawer} role="presentation">
            {selectedAsagohan ? (
              selectedAsagohan.comments.map((comment, index) => {
                return (
                  <div key={index} className={styles.usercomment}>
                    <Link href={`/user/${comment.user.accountID}`}>
                      <div className={styles.useravatar}>
                        <Avatar
                          alt="コメント者イラスト"
                          src={comment.user.userIconPath}
                          sx={{ width: "46px", height: "46px" }}
                        />
                      </div>
                    </Link>
                    <div className={styles.timecomment}>
                      <p style={{ marginTop: "0", marginBottom: "0" }}>
                        <Link href={`/user/${comment.user.accountID}`}>
                          <span style={{ color: "#402011" }}>
                            {comment.user.name}
                          </span>
                        </Link>
                        <span style={{ color: "#605b58", paddingLeft: "10px" }}>
                          {comment.createdAt}
                        </span>
                      </p>
                      <p
                        style={{
                          color: "#402011",
                          marginTop: "0",
                          marginBottom: "0",
                        }}
                      >
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.usercomment}></div>
            )}
            <div className={styles.commentpush}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ width: "100%", maxWidth: "100%" }}
              >
                <TextField
                  label="コメントを入力..."
                  variant="outlined"
                  fullWidth
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": { fontFamily: "var(--font)" },
                    "& input": { color: "var(--primary)" },
                    "& label": { fontFamily: "var(--font)" },
                  }}
                />
                <Button
                  onClick={() => handleSend(selectedAsagohan, currentComment)}
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={commentSending}
                  sx={{ backgroundColor: "#5a2d0c", color: "white" }}
                >
                  Send
                </Button>
              </Stack>
            </div>
          </div>
        </Drawer>
        {asagohans?.map((asagohan, index) => {
          return (
            <div key={index} className={styles.userpush}>
              <div className={styles.acount}>
                <Link href={`/user/${asagohan.user.accountID}`}>
                  <div className={styles.third}>
                    <Avatar
                      alt="投稿者イラスト"
                      src={asagohan.user.userIconPath}
                    />
                    <p>{asagohan.user.name}</p>
                  </div>
                </Link>
                <p className={styles.time}>{asagohan.createdAt}</p>
              </div>
              <div className={styles.container}>
                <Image
                  className={styles.post}
                  src={asagohan.imagePath}
                  alt="朝ごはん投稿画像"
                  width={319}
                  height={229}
                />
              </div>
              <div className={styles.forth}>
                <div className={styles.button}>
                  <div className={styles.good}>
                    <Image
                      onClick={() => handleClick(asagohan)}
                      className={styles.goodbutton}
                      src={
                        asagohan.isLiked
                          ? "いいね後のボタン.svg"
                          : "いいね前のボタン.svg"
                      }
                      alt="いいね前のボタン画像"
                      width={25}
                      height={25}
                    />
                    <p className={styles.goodcount}>{asagohan.likes}</p>
                  </div>
                  <div
                    onClick={() => setSelectedAsagohan(asagohan)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.comment}>
                      <Image
                        className={styles.commentbutton}
                        src="コメントボタン.svg"
                        alt="コメントボタン画像"
                        width={25}
                        height={25}
                      />
                      <p className={styles.commentcount}>
                        {asagohan.comments.length}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={styles.title}>{asagohan.title}</p>
              </div>
              <div className={styles.rankingstar}>
                <Image
                  className={styles.star}
                  src="ランキング星画像.svg"
                  alt="ランキング星画像"
                  width={70}
                  height={70}
                />
                <p className={styles.rankingcount}>{asagohan.ranking}</p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
