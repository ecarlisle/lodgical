import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  tone?: "info" | "error";
  children: ReactNode;
};

export function StatusMessage({ tone = "info", children }: StatusMessageProps) {
  return (
    <div
      className={styles.message}
      data-tone={tone}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
