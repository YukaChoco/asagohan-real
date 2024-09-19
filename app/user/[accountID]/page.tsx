"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Header from "@/app/components/Header";
import Badge from "@mui/material/Badge";
import Avatar, {
  AvatarOwnProps,
  AvatarSlotsAndSlotProps,
} from "@mui/material/Avatar"; // 必要に応じてインポート
import { CommonProps } from "@mui/material/OverridableComponent";
import { JSX, ElementType, useState, useEffect } from "react";
import useUserProfile from "@/app/hooks/useUserProfile";
import { Button, IconButton, Modal, TextField } from "@mui/material";
import Box from "@mui/material/Box";

// SmallAvatar の定義
const SmallAvatar = (
  props: JSX.IntrinsicAttributes & {
    component: ElementType<JSX.Element, keyof JSX.IntrinsicElements>;
  } & AvatarOwnProps &
    AvatarSlotsAndSlotProps &
    CommonProps
) => <Avatar {...props} sx={{ width: 40, height: 40 }} />;

export default function Home({ params }: { params: { accountID: string } }) {
  const accountID = params.accountID;
  const {
    userProfile,
    todayUserProfileFetching,
    updateUserName,
    updateUserIcon,
  } = useUserProfile(accountID);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState<string>("");
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const [newIcon, setNewIcon] = useState<File | null>(null);
  const [newIconPath, setNewIconPath] = useState<string>("");

  useEffect(() => {
    if (userProfile) {
      setNewName(userProfile.name);
      setNewIconPath(userProfile.userIconPath);
    }
  }, [userProfile]);

  const handleNewNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // デフォルトのフォーム送信を無効化
    await updateUserName(newName); // ユーザー名を更新
    setIsEditingName(false); // モーダルを閉じる
  };

  const handleNewIconSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // デフォルトのフォーム送信を無効化
    if (!newIcon) return;

    await updateUserIcon(newIcon); // ユーザーアイコンを更新
    setIsEditingIcon(false); // モーダルを閉じる
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNewIcon(file);
    setNewIconPath(URL.createObjectURL(file));
  };

  if (todayUserProfileFetching) {
    return <main>Loading...</main>;
  }
  if (!userProfile) {
    return <main>Not Found</main>;
  }

  const modalStyle = {
    bgcolor: "var(--light)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    boxShadow: 24,
    p: 4,
    fontFamily: "var(--font)",
  };

  return (
    <main className={styles.main}>
      <Header>
        <Link className={styles.arrow} href={"/"} >←</Link>
        <h1 className={styles.h1}>ユーザプロフィール</h1>
        <div></div>
      </Header>

      <Modal
        open={isEditingName}
        onClose={() => setIsEditingName(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleNewNameSubmit}>
            <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
              <TextField
                id="newName"
                variant="outlined"
                fullWidth
                label="ユーザネーム"
                name="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                sx={{
                  // 入力値にフォントを適用
                  "& .MuiOutlinedInput-root": { fontFamily: "var(--font)" },
                  "& input": {
                    color: "var(--primary)",
                  },
                  "& label": {
                    fontFamily: "var(--font)",
                  },
                }}
              />
              <Button type="submit" variant="contained">
                完了
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal
        open={isEditingIcon}
        onClose={() => setIsEditingIcon(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleNewIconSubmit}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"20px"}
              alignItems={"center"}
              width={"100%"}
            >
              <label htmlFor="file-input">
                <Image
                  src={newIconPath}
                  alt={"新しいアイコン画像"}
                  width={200}
                  height={200}
                  style={{ borderRadius: "50%" }}
                />
                <input
                  id="file-input"
                  type="file"
                  accept="image/png"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </label>
              <Button type="submit" variant="contained" fullWidth>
                完了
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <div className={styles.iconPicture}>
        <div className={styles.changeIcon}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                onClick={() => setIsEditingIcon(true)}
                sx={{ width: "fit-content" }}
              >
                <SmallAvatar
                  alt="camera"
                  src="/camera.svg"
                  component={"symbol"}
                />
              </IconButton>
            }
          >
            <Image
              className={styles.userIcon}
              src={userProfile.userIconPath}
              alt={"ユーザのアイコン画像"}
              width={200}
              height={200}
              style={{ borderRadius: "50%" }}
            />
          </Badge>
        </div>

        <div className={styles.account_name}>
          {userProfile.name}
          <IconButton
            onClick={() => setIsEditingName(true)}
            sx={{ width: "fit-content" }}
          >
            <Image src="/pen.svg" alt={"pen"} height={16} width={16} />
          </IconButton>
        </div>
      </div>

      <div className={styles.usericonTextContainer}>
        <div className={styles.iconTextContainer}>
          <Image
            src="/icon512_maskable.png"
            alt={"Icon"}
            height={30}
            width={30}
          />
          べすと朝ごはん！
        </div>

        <div className={styles.profile1}>
          <Image
            src={userProfile.bestAsagohan.imagePath}
            alt={"AsagohanPicture"}
            height={100}
            width={150}
          />
        </div>
      </div>

      <div className={styles.weeklyAsagohan}>
        <div className={styles.iconTextContainer}>
          <Image
            src="/icon512_maskable.png"
            alt={"Icon"}
            height={30}
            width={30}
          />
          今週の朝ごはん
        </div>

        <div className={styles.week_asagohan}>
          <div className={styles.scroll}>
            {userProfile.thisWeekAsagohans.map((thisWeekAsagohan, index) => (
              <div key={index} className={styles.profile2}>
                <Image
                  src={thisWeekAsagohan.imagePath}
                  alt={"WeeklyAsagohan"}
                  height={100}
                  width={150}
                />
                <div className={styles.date}>{thisWeekAsagohan.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
