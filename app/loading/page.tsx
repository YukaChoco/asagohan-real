"use client";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
    return (
        <div className={styles.page}>
            <Image className={styles.bread} src="/bread.png" alt="bread" width={200} height={200} />
            <div>loading......</div>
            </div>

    );
}
