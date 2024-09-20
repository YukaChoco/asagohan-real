"use client";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Box, Button, Modal, TextField } from "@mui/material";
import React from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "var(--primary)",
  zIndex: 1300, // Ensure the modal is on top
};

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState<string>("");

  // Handle image upload and open modal after the image is loaded
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setOpen(true); // Open the modal after the image is loaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal manually
  const handleOpen = () => {
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle the "完了" button click
  const handleSubmit = () => {
    console.log("タイトル: ", newName); // Log the new name for now
    setOpen(false); // Close the modal after submitting
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>
        起きろ!
        <br />
        朝ごはんReal.
      </h1>

      <div>
        <label htmlFor="file-input">
          <Image
            className={styles.camera_button}
            alt="camera_button.svg"
            src="/camera_button.svg"
            width={80}
            height={80}
          />
          <input
            id="file-input"
            type="file"
            capture="environment"
            accept="image/png"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>

        <Image
          className={styles.post}
          src={selectedImage || "朝ごはん投稿画像.svg"}
          alt="朝ごはん投稿画像"
          width={400}
          height={400}
        />

        {/* Button to manually open the modal */}
        <Button onClick={handleOpen}>Open modal</Button>

        {/* Modal structure */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <TextField
              id="newName"
              variant="outlined"
              fullWidth
              label="タイトル"
              name="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)} // Update newName state when input changes
              sx={{
                mt: 2, // Add margin top for better spacing
                "& .MuiOutlinedInput-root": { fontFamily: "var(--font)" },
                "& input": {
                  color: "var(--primary)",
                },
                "& label": {
                  fontFamily: "var(--font)",
                },
              }}
            />

            {/* Button to submit and close the modal */}
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 2 }} // Add margin top for spacing
            >
              完了
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
