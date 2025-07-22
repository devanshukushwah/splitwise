import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiContextProvider } from "@/context/ApiStateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Splitwise",
  description: "This is a web app to split expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApiContextProvider>{children}</ApiContextProvider>
      </body>
    </html>
  );
}
