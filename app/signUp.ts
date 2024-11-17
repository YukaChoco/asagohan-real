import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "@/app/firebase";

const signUp = async (
  email: string,
  password: string,
): Promise<{ userID: string; errorMessage: string | null }> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // サインアップ成功
    const user = userCredential.user;
    console.log("User signed up:", user);

    if (!user) {
      const errorCode = 400;
      const errorMessage = "Failed to sign up: user is null";
      console.error("Error signing up:", errorCode, errorMessage);
      return { userID: "", errorMessage: errorMessage };
    }
    if (!user.uid) {
      const errorCode = 400;
      const errorMessage = "Failed to sign up: user.uid is null";
      console.error("Error signing up:", errorCode, errorMessage);
      return { userID: "", errorMessage: errorMessage };
    }

    return {
      userID: user.uid,
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = (error as { message: string }).message;
    return { userID: "", errorMessage: errorMessage };
  }
};

export default signUp;
