"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import useTodayAsagohans from "@/app/hooks/useTodayAsagohans";
import { Avatar } from "@mui/material";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Asagohan from "./types/Asagohan";
import useUserAuth from "./hooks/useUserAuth";
import { useState } from "react";
import Loading from "./components/Loading";

export default function Home() {
  const { userID, accountID, authLoading } = useUserAuth();
  const { asagohans, todayAsagohansFetching, onClickLike } = useTodayAsagohans(
    userID || ""
  );
  const [selectedAsagohan, setSelectedAsagohan] = useState<Asagohan | null>(
    null
  );

  if (authLoading || todayAsagohansFetching) {
    return <Loading />;
  }
  if (!asagohans || asagohans.length === 0) {
    return <main>本日の朝ごはんはまだ投稿されていません</main>;
  }

  const handleClick = (asagohan: Asagohan) => {
    console.log("クリックされました");
    onClickLike(asagohan);
  };

  const drawerIsOpen = selectedAsagohan !== null;

  return (
    <div className={styles.page}>
      <Header>
        <div className={styles.first}>
          <Image
            className={styles.aikon}
            src="ロゴアイコン.svg"
            alt="ロゴアイコン画像"
            width={60}
            height={60}
          />
          <h1 className={styles.h1}>
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
          anchor="bottom"
          open={drawerIsOpen}
          onClose={() => setSelectedAsagohan(null)}
        >
          <div className={styles.drawer} role="presentation">
            {selectedAsagohan ? (
              selectedAsagohan.comments.map((comment, index) => {
                return (
                  <div key={index} className={styles.usercomment}>
                    <div className={styles.useravatar}>
                      <Avatar
                        alt="コメント者イラスト"
                        src={comment.user.userIconPath}
                      />
                    </div>
                    <div className={styles.timecomment}>
                      <p style={{ marginTop: "0", marginBottom: "0" }}>
                        <span style={{ color: "#402011" }}>
                          {comment.user.name}
                        </span>
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
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              />
              <TextField
                label="コメントを入力..."
                id="outlined-size-small"
                fullWidth
                sx={{
                  // 入力値にフォントを適用
                  "& .MuiOutlinedInput-root": { fontFamily: "var(--font)" },
                  "& input": {
                    color: "var(--primary)",
                  },
                  "& label": {
                    fontFamily: "var(--font)",
                  },
                  position: "fixed",
                  bottom: "20px",
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    position: "fixed",
                    right: "30px",
                    bottom: "20px",
                  }}
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
                <div className={styles.third}>
                  <Avatar
                    alt="投稿者イラスト"
                    src={asagohan.user.userIconPath}
                  />
                  <p>{asagohan.user.name}</p>
                </div>
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
