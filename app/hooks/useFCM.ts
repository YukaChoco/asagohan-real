"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const useFCM = () => {
  const [fcmToken, setToken] = useState<string | null>(null);
  console.log("fcmToken:", fcmToken);

  useEffect(() => {
    const messaging = getMessaging(app);
    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    // tokenを取得
    const getUserToken = async () => {
      try {
        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setToken(currentToken);
          // サーバーにトークンを送信
          //   await fetch("/api/save-token", {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ token: currentToken }),
          //   });
        } else {
          console.log("No registration token available.");
        }
      } catch (err) {
        console.error("An error occurred while retrieving token.", err);
      }
    };
    getUserToken();
  }, []);

  return {};
};

export default useFCM;
