// src/components/Header/Header.jsx
import { NavLink } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand}>
  Travel<span className={styles.title}>Trucks</span>
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
      </div>
    </header>
  );
}
