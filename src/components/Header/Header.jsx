// src/components/Header/Header.jsx
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand}>
          Travel<span className={styles.headtitle}>Trucks
            </span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Catalog
          </NavLink>
        </nav>

        {/* sağ kolonu boş bırakıyoruz ki nav tam ortada kalsın */}
        <div className={styles.rightSpace} />
      </div>
    </header>
  );
}
