"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import Avatar from "@mui/material/Avatar";
import { Badge, Button } from "@mui/material";
import usePostUser from "@/app/hooks/usePostUser";
import Loading from "@/app/components/Loading";
import signUp from "@/app/signUp";
import { useRouter } from "next/navigation";

interface SmallAvatarProps {
  alt: string;
  src: string;
}

const SmallAvatar: React.FC<SmallAvatarProps> = (props) => (
  <Avatar
    {...props}
    sx={{ width: 40, height: 40, border: "2px solid white" }}
  />
);

export default function Home() {
  const [accountID, setAccountID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { postUser, userSending } = usePostUser();

  useEffect(() => {
    if (username && email && password && confirmPassword && selectedImage) {
      if (password === confirmPassword) {
        setIsButtonEnabled(true);
        setErrorMessage("");
      } else {
        setIsButtonEnabled(false);
        setErrorMessage("パスワードが一致しません");
      }
    } else {
      setIsButtonEnabled(false);
      setErrorMessage("すべて入力して下さい");
    }
  }, [username, email, password, confirmPassword, selectedImage]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedImage
    ) {
      setErrorMessage("全て入力してください");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    try {
      const signUpResult = await signUp(email, password);

      if (signUpResult.errorMessage) {
        setErrorMessage(
          `サインアップに失敗しました: ${signUpResult.errorMessage}`,
        );
        return;
      }

      const userID = signUpResult.userID;

      if (!userID) {
        setErrorMessage("ユーザーIDが取得できませんでした");
        return;
      }

      // ユーザー情報をデータベースに保存
      if (userID && selectedImageFile) {
        await postUser(userID, username, accountID, selectedImageFile);
        setLoading(false);
        window.location.href = "/";
      }

      // サインアップが成功した場合、ユーザー情報をデータベースに保存
    } catch (error) {
      setErrorMessage(`登録中にエラーが発生しました: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>新規アカウント登録</h1>

      <form className={styles.form} onSubmit={handleSubmit} id="sign-up">
        <div className={styles.iconPicture}>
          <div className={styles.changeIcon}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <label htmlFor="file-input">
                  <SmallAvatar alt="camera" src="/camera.svg" />
                  <input
                    id="file-input"
                    type="file"
                    capture="environment"
                    accept="image/png"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </label>
              }
            >
              <Avatar
                className={styles.icon}
                src={selectedImage || "/default_icon.svg"}
                alt="default Icon"
                sx={{ width: "170px", height: "170px" }}
              />
            </Badge>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="アカウントID"
            className={styles.input}
            value={accountID}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAccountID(e.target.value)
            }
          />
          <input
            type="text"
            placeholder="ユーザ名"
            className={styles.input}
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <input
            type="email"
            placeholder="メールアドレス"
            className={styles.input}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="パスワード (半角英数字)"
            className={styles.input}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="パスワード (再入力)"
            className={styles.input}
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>

      <Button
        variant="outlined"
        form="sign-up"
        type="submit"
        className={styles.button}
        disabled={!isButtonEnabled || userSending}
        fullWidth
        sx={{ mt: 2 }}
      >
        新規登録
      </Button>
    </main>
  );
}
