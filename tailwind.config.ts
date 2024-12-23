import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F0F0E5",
        producer: {
          DEFAULT: "#A0522D",
          hover: "#8B4513"
        },
        analyst: {
          DEFAULT: "#8BA989",
          hover: "#6E8F6E"
        },
        judge: {
          DEFAULT: "#C4A484",
          hover: "#B08B64"
        }
      }
    }
  }
} satisfies Config;