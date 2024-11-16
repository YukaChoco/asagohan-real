"use client";
import { useEffect, useState } from "react";
import type { RankingAsagohan } from "@/app/types/Asagohan";

const useRankingAsagohans = () => {
  const [asagohans, setAsagohans] = useState<RankingAsagohan[] | null>(null);
  const [fetching, setFetching] = useState(true);

  const getRankingAsagohans = async (): Promise<RankingAsagohan[]> => {
    const res = await fetch("/api/ranking/asagohans");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const asagohans = await res.json();
    return asagohans.data;
  };

  useEffect(() => {
    setFetching(true);
    getRankingAsagohans()
      .then((fetchedAsagohans) => {
        setAsagohans(fetchedAsagohans);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  return {
    asagohans,
    rankingAsagohansFetching: fetching,
  };
};

export default useRankingAsagohans;
