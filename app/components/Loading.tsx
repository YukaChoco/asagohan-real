"use client";
import styles from "./Loading.module.css";
import Image from "next/image";

export default function Loading() {
    return (
        <div className={styles.page}>
            <Image className={styles.bread} src="/bread.png" alt="bread" width={200} height={200} />
            <div>loading......</div>
        </div>
    );
}
