"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [position, setPosition] = useState<"top-center" | "bottom-right">(
    "bottom-right",
  );

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setPosition("top-center"); // mobile
      } else {
        setPosition("bottom-right"); // desktop
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
