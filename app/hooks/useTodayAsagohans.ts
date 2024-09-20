"use client";
import { useEffect, useState } from "react";
import type Asagohan from "@/app/types/Asagohan";

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
    newLikes: number
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
    asagohans,
    todayAsagohansFetching: fetching,
    setAsagohanLike,
    onClickLike,
  };
};

export default useTodayAsagohans;
