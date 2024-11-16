import React from "react";
import { Box, Button, Modal } from "@mui/material";
import useUserAuth from "../hooks/useUserAuth";

const NoAuthenticatedModal = () => {
  const { isAuthenticated } = useUserAuth();
  return (
    <Modal open={!isAuthenticated}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <h2>ログインしてください</h2>
        <a
          href="/login"
          style={{ width: "80%", height: "fit-content", marginBottom: "40px" }}
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
            ログイン
          </Button>
        </a>
      </Box>
    </Modal>
  );
};
export default NoAuthenticatedModal;
