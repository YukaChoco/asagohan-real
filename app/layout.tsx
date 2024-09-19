import type { Metadata } from "next";
import "./globals.css";
import { Yusei_Magic } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";

const yuseiMagic = Yusei_Magic({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "起きろ！朝ごはんReal.",
  description:
    "毎朝朝ごはんの写真を共有することで、互いに健康的な毎日をスタートすることができる新感覚SNSです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#402011" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body className={yuseiMagic.className}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
