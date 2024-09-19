"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import Avatar from "@mui/material/Avatar";
import { Badge } from "@mui/material";


interface SmallAvatarProps {
    alt: string;
    src: string;
}

const SmallAvatar: React.FC<SmallAvatarProps> = (props) => (
    <Avatar {...props} sx={{ width: 40, height: 40, border: "2px solid white" }} />
);

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword || !selectedImage) {
            setErrorMessage("全て入力してください");
        } else if (password !== confirmPassword) {
            setErrorMessage("パスワードが一致しません");
        } else {
            setErrorMessage("");
            alert("登録が完了しました！");
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>新規アカウント登録</h1>

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

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ユーザ名"
                    className={styles.input}
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="メールアドレス"
                    className={styles.input}
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="パスワード (半角英数字)"
                    className={styles.input}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="パスワード (再入力)"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                <button
                    type="submit"
                    className={styles.button}
                    disabled={!isButtonEnabled}
                >
                    新規登録
                </button>
            </form>
        </div>
    );
}
