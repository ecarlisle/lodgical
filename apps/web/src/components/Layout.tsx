import { Link, Outlet } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div id="top" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <LogoMark className={styles.logoMark} />
            <span className={styles.wordmark}>Lodgical</span>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <LogoMark size={20} className={styles.logoMark} />
            <div>
              <span className={styles.footerWordmark}>Lodgical</span>
              <p>Thoughtful stays for memorable trips.</p>
            </div>
          </div>

          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link to="/">Browse stays</Link>
            <a href="#top">Back to top</a>
          </nav>

          <p className={styles.footerMeta}>
            Demo experience · No real payments are processed.
          </p>
        </div>
      </footer>
    </div>
  );
}
