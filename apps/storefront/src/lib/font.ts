import { Bebas_Neue, Instrument_Sans, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const fontList = [inter, bebasNeue, instrumentSans];

export const fontVariables = fontList.map((font) => font.variable).join(" ");
