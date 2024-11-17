"use client";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import { useEffect } from "react";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const useFCM = async () => {
  useEffect(() => {
    const getUserToken = async () => {
      try {
        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken) {
          console.log("FCM Token:", currentToken);
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
