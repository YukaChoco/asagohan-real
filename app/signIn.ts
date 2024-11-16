import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";

const signIn = async (
  email: string,
  password: string,
): Promise<{ userID: string; errorMessage: string | null }> => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
      });

    const user = auth.currentUser;

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
    const errorCode = (error as { code: string }).code;
    const errorMessage = (error as { message: string }).message;
    console.error("Error signing in:", errorCode, errorMessage);
    return { userID: "", errorMessage: errorMessage };
  }
};

export default signIn;
