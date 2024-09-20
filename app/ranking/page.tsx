"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import { Avatar } from "@mui/material";
import useRankingAsagohans from "../hooks/useRankingAsagohans";
import useUserAuth from "../hooks/useUserAuth";
import Loading from "../components/Loading";

export default function Home() {
  const { authLoading } = useUserAuth();
  const { asagohans, rankingAsagohansFetching } = useRankingAsagohans();
  console.log(asagohans, rankingAsagohansFetching);

  if (authLoading || rankingAsagohansFetching) {
    return <Loading />
  }
  if (!asagohans) {
    return <main>データが存在しません</main>;
  }

  return (
    <div className={styles.page}>
      <Header>
        <Link className={styles.arrow} href={"/"}>
          ←
        </Link>
        <h1 className={styles.h1}>ランキング！</h1>
        <div></div>
      </Header>

      <main className={styles.main}>
        {asagohans.map((asagohan, index) => {
          return (
            <div key={index} className={styles.asagohan}>
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

              <div className={styles.acount}>
                <div className={styles.third}>
                  <Avatar alt="投稿者イラスト" src="user_image.png" />
                  <div className={styles.account_name}>アカウント名</div>
                </div>
                <div className={styles.button}>
                  <div className={styles.good}>
                    <div className={styles.good_count}>{asagohan.likes}</div>
                    <Image
                      className={styles.goodbutton}
                      src="いいねボタン.svg"
                      alt="いいねボタン画像"
                      width={25}
                      height={25}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.container}>
                <Image
                  className={styles.post}
                  src="朝ごはん投稿画像.svg"
                  alt="朝ごはん投稿画像"
                  width={300}
                  height={300}
                />
              </div>
              <div className={styles.forth}>
                <p className={styles.title}>{asagohan.title}</p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
