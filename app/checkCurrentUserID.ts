import { auth } from "@/app/firebase";

const checkCurrentUserID = async (): Promise<{
  userID: string;
  errorMessage: string | null;
}> => {
  return new Promise((resolve) => {
    // 認証状態の監視
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();

      if (!user) {
        const errorCode = 400;
        const errorMessage = "ユーザーがサインインしていません。";
        console.error("Error signing in:", errorCode, errorMessage);
        resolve({ userID: "", errorMessage: errorMessage });
      } else if (!user.uid) {
        const errorCode = 400;
        const errorMessage = "ユーザーのUIDが取得できません。";
        console.error("Error signing in:", errorCode, errorMessage);
        resolve({ userID: "", errorMessage: errorMessage });
      } else {
        resolve({ userID: user.uid, errorMessage: null });
      }
    });
  });
};

export default checkCurrentUserID;
