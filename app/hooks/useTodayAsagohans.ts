"use client";
import { useEffect, useState } from "react";
import type Asagohan from "@/app/types/Asagohan";

//朝ごはんの仮のデータを作成

const MOCK_ASAGOHANS: Asagohan[] = [
  {
    id: "1",
    createdAt: "2021-10-01T12:34:56.789Z",
    title: "朝ごはん1",
    imagePath:
      "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/asagohans/0.png",
    isLiked: false,
    likes: 10,
    comments: [],
    user: {
      id: "1",
      accountID: "user1",
      name: "ユーザー1",
      userIconPath:
        "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/asagohans/0.png",
    },
    ranking: 1,
  },
  {
    id: "2",
    createdAt: "2021-10-01T12:34:56.789Z",
    title: "朝ごはん1",
    imagePath:
      "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/asagohans/0.png",
    isLiked: false,
    likes: 10,
    comments: [],
    user: {
      id: "1",
      accountID: "user1",
      name: "ユーザー1",
      userIconPath:
        "https://prkmeuqkrooltclacpzl.supabase.co/storage/v1/object/public/asagohans/0.png",
    },
    ranking: 2,
  },
];

const useTodayAsagohans = (userID: string) => {
  const [asagohans, setAsagohans] = useState<Asagohan[] | null>(null);
  const [fetching, setFetching] = useState(false);

  const getTodayAsagohans = async (userID: string): Promise<Asagohan[]> => {
    const res = await fetch(`/api/asagohans/${userID}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const asagohans = await res.json();
    return asagohans.data;
  };

  useEffect(() => {
    setFetching(true);
    getTodayAsagohans(userID)
      .then((asagohans) => {
        setAsagohans(asagohans);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [userID]);

  const setAsagohanLike = async (
    asagohanID: string,
    newIsLiked: boolean,
    newLikes: number,
  ) => {
    if (asagohans) {
      const updatedAsagohans = asagohans.map((asagohan) => {
        if (asagohan.id === asagohanID) {
          return { ...asagohan, isLiked: newIsLiked, likes: newLikes };
        }
        return asagohan;
      });
      setAsagohans([...updatedAsagohans]);
    } else {
      console.error("この朝ごはんは存在しません");
    }
  };

  const onClickLike = async (asagohan: Asagohan) => {
    const asagohanID = asagohan.id;
    const isLiked = asagohan.isLiked;
    const likes = asagohan.likes;
    if (!isLiked) {
      setAsagohanLike(asagohan.id, true, asagohan.likes + 1);
      const res = await fetch(`/api/asagohan/${asagohanID}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
        }),
      });
      if (res.status !== 201) {
        console.error(res.statusText);
      }
    } else {
      setAsagohanLike(asagohan.id, false, asagohan.likes - 1);
      const res = await fetch(`/api/asagohan/${asagohanID}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
        }),
      });
      if (res.status !== 200) {
        console.error(res.statusText);
      }
      return { isLiked, likes };
    }
  };

  return {
    asagohans: MOCK_ASAGOHANS,
    todayAsagohansFetching: fetching,
    setAsagohanLike,
    onClickLike,
  };
};

export default useTodayAsagohans;
