import { Link, Outlet } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <LogoMark className={styles.logoMark} />
            <span>Lodgical</span>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
