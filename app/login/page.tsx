"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import supabase from "../supabase";
import { Button } from "@mui/material";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // 入力が変わるたびにボタンの状態を更新する
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("全て入力してください");
      setSuccessMessage(""); // 成功メッセージはクリア
      return;
    }

    // Supabaseでサインイン
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage("ログインに失敗しました: " + error.message);
      setSuccessMessage(""); // 成功メッセージはクリア
    } else {
      setErrorMessage(""); // エラーメッセージはクリア
      window.history.back();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>ログイン</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="メールアドレス"
            className={styles.input}
            value={email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="パスワード (半角英数字)"
            className={styles.input}
            value={password}
            onChange={handleInputChange}
          />

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--light)",
              color: "var(--primary)",
              fontFamily: "var(--font)",
              marginTop: "40px",
            }}
          >
            ログイン
          </Button>
        </form>
      </div>

      <div className={styles.footer}>
        <div className={styles.makeAccount}>初めての方はこちら</div>

        <a
          href="/account"
          style={{ width: "80%", height: "fit-content", marginTop: "40px" }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "var(--light)",
              color: "var(--primary)",
              fontFamily: "var(--font)",
            }}
            role="link"
          >
            新規アカウント登録
          </Button>
        </a>
      </div>
    </main>
  );
}
