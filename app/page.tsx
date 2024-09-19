"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import { useState } from "react";
import useTodayAsagohans from "@/app/hooks/useTodayAsagohans";
import { Avatar } from "@mui/material";

const testAsagohans = [
  {
    id: "1",
    createdAt: "8時30分",
    title: "test朝ごはん",
    imagePath: "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/asagohans/2.png",
    likes: 10,
    isLiked: true,
    ranking: 1,
    comments: [
      {
        content: "おいしそう!",
        createdAt: "8時31分",
        user: {
          name: "testユーザー",
          accountID: "test-user",
          userIconPath:
            "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/user_icons/79441e4f-39bc-4d2e-978b-68d5907000c2.png",
        },
      },
      {
        content: "早起きえらい",
        createdAt: "10時31分",
        user: {
          name: "testユーザー",
          accountID: "test-user",
          userIconPath:
            "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/user_icons/79441e4f-39bc-4d2e-978b-68d5907000c2.png",
        },
      },
    ],
    user: {
      name: "test-yuka",
      accountID: "test-user",
      userIconPath:
        "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/user_icons/79441e4f-39bc-4d2e-978b-68d5907000c2.png",
    },
  },
];
export default function Home() {
  const [userID] = useState("b2113406-aaaf-43bc-a32c-a5cc003506d7");
  const { asagohans, todayAsagohansFetching } = useTodayAsagohans(userID);
  console.log(asagohans, todayAsagohansFetching);
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
          <Link href={"/ranking"}>
            <Image
              className={styles.ranking}
              src="ランキング画像.svg"
              alt="ランキング画像"
              width={50}
              height={50}
            />
          </Link>
          <Link href={"/user/1"}>
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
        <div className={styles.acount}>
          <div className={styles.third}>
            <Avatar
              alt="投稿者イラスト"
              src="user_image.png"
            />
            <p>{testAsagohans[0].user.name}</p>
          </div>
          <p className={styles.time}>
            ○時○分
          </p>
        </div>
        <div className={styles.container}>
          <Image className={styles.post}
            src="朝ごはん投稿画像.svg"
            alt="朝ごはん投稿画像"
            width={300}
            height={300}
          />
        </div>
        <div className={styles.forth}>
          <div className={styles.button}>
            <div className={styles.good}>
              <Image className={styles.goodbutton}
                src="いいねボタン.svg"
                alt="いいねボタン画像"
                width={25}
                height={25}
              />
              <p className={styles.goodcount}>
                xx
              </p>
            </div>
            <div className={styles.comment}>
              <Image className={styles.commentbutton}
                src="コメントボタン.svg"
                alt="コメントボタン画像"
                width={25}
                height={25}
              />
              <p className={styles.commentcount}>
                xx
              </p>
            </div>
          </div>
          <p className={styles.title}>
            今日のタイトル
          </p>
        </div>
        <div className={styles.rankingstar}>
          <Image className={styles.star}
            src="ランキング星画像.svg"
            alt="ランキング星画像"
            width={70}
            height={70}
          />
          <p className={styles.rankingcount}>
            1
          </p>
        </div>
      </main>
    </div>
  );
}
