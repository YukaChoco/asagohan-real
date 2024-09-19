"use client";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";
import Image from 'next/image';

export default function Home() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // カメラを起動する関数
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 }, // 解像度を指定 (理想的な幅)
                    height: { ideal: 720 },  // 解像度を指定 (理想的な高さ)
                },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("カメラにアクセスできませんでした:", err);
        }
    };

    // 写真を撮影する関数
    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const width = videoRef.current.videoWidth;
                const height = videoRef.current.videoHeight;
                canvasRef.current.width = width;
                canvasRef.current.height = height;
                context.drawImage(videoRef.current, 0, 0, width, height);  // ビデオの現在のフレームをキャンバスに描画
                canvasRef.current.style.display = "block";  // 撮影後にキャンバスを表示
            }
        }
    };

    // ページがロードされたときにカメラを起動
    useEffect(() => {
        startCamera();
    }, []);

    return (
        <div className={styles.page}>
            <h1 className={styles.h1}>
                起きろ!
                <br />
                朝ごはんReal.
            </h1>

            <main className={styles.main}>
                <div className={styles.container}>
                    <video
                        ref={videoRef}
                        autoPlay
                        className={styles.cameraFeed}
                        width={380}
                        height={380}
                    />
                    <canvas
                        ref={canvasRef}
                        className={styles.cameraFeed}
                        style={{ display: 'none' }}  // 最初は非表示にしておく
                    />
                </div>
                <Image
                    className={styles.camera_button}
                    src="camera_button.svg"
                    alt="カメラボタン"
                    width={80}
                    height={80}
                    onClick={takePicture}  // ボタンクリックで写真を撮影
                />
            </main>
        </div>
    );
}
