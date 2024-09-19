"use client";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/app/types/User";
import supabase from "../supabase";

const useUserProfile = (accountID: string) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState(true);

  const getUserProfile = async (accountID: string): Promise<UserProfile> => {
    const res = await fetch(`http://localhost:3000/api/user/${accountID}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const userProfile = await res.json();
    return userProfile.data;
  };

  useEffect(() => {
    setFetching(true);
    getUserProfile(accountID)
      .then((fetchedUserProfile) => {
        setUserProfile(fetchedUserProfile);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [accountID]);

  const updateUserName = async (newName: string) => {
    if (userProfile) {
      const res = await fetch(
        `http://localhost:3000/api/user/${accountID}/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update user name");
      } else {
        location.reload();
      }
    } else {
      console.error("このユーザーは存在しません");
    }
  };

  // 画像の更新処理を追加
  const updateUserIcon = async (newIcon: File) => {
    if (userProfile) {
      const removeHyphen = (id: string) => id.replace(/-/g, "");

      const { error } = await supabase.storage
        .from("user_icons")
        .update(`${removeHyphen(userProfile.id)}.png`, newIcon);
      if (error) {
        throw new Error("Failed to update user icon");
      }
      location.reload();
    } else {
      console.error("このユーザーは存在しません");
    }
  };

  return {
    userProfile,
    todayUserProfileFetching: fetching,
    updateUserName,
    updateUserIcon,
  };
};

export default useUserProfile;
