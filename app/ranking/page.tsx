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
    return <Loading />;
  }

  if (!asagohans || asagohans.length === 0) {
    return (
      <div className={styles.page}>
        <Header>
          <Link className={styles.arrow} href={"/"}>
            ←
          </Link>
          <h1 className={styles.h1}>ランキング！</h1>
          <div></div>
        </Header>
        <main>誰もまだ朝ごはんを投稿していません</main>
      </div>
    );
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
                  <Avatar alt="投稿者イラスト" src={asagohan.user.userIconPath} />


                  <div className={styles.account_name}>{asagohan.user.name}</div>
                </div>
                <div className={styles.button}>
                  <div className={styles.good}>
                    <div className={styles.good_count}>{asagohan.likes}</div>
                    <Image
                      className={styles.goodbutton}
                      src="いいね前のボタン.svg"
                      alt="いいねボタン画像"
                      width={25}
                      height={25}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.container}>
                <div className={styles.flame}>
                <Image
                  className={styles.post}
                  src={asagohan.imagePath}
                  alt={asagohan.title}
                  width={319}
                  height={229}
                />
                </div>
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
