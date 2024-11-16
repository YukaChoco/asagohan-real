"use client";
import { useState, useEffect } from "react";
import checkCurrentUserID from "@/app/checkCurrentUserID";
import { useFCM } from "./useFCM";

const useUserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [accountID, setAccountID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccountID = async (loginUserID: string) => {
    try {
      const res = await fetch(`/api/user/auth/${loginUserID}`);
      console.log("res", res);
      if (!res.ok) {
        setAccountID(null);
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setAccountID(data);
    } catch (error) {
      console.error("Error fetching accountID:", error);
      setAccountID(null);
    }
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const checkCurrentUserIDResponse = await checkCurrentUserID();
        const currentUserID = checkCurrentUserIDResponse.userID;
        const errorMessage = checkCurrentUserIDResponse.errorMessage;
        if (checkCurrentUserIDResponse.errorMessage) {
          console.error("Error checking authentication:", errorMessage);
          throw new Error(checkCurrentUserIDResponse.errorMessage);
        }
        if (currentUserID) {
          setIsAuthenticated(true);
          setUserID(currentUserID);
          await fetchAccountID(currentUserID);
        } else {
          setIsAuthenticated(false);
          setUserID(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUserID(null);
      } finally {
        useFCM();
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  return { userID, accountID, authLoading: loading, isAuthenticated };
};

export default useUserAuth;
