import Header from "../../components/Layout/Layout";
import styles from "./HomePage.module.css";
import heroImg from "../../assets/hero.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.hero} style={{ "--hero": `url(${heroImg})` }}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Campers of your dreams</h1>
            <p className={styles.text}>
              You can find everything you want in our catalog
            </p>

            <Link className={styles.button} to="/catalog">
              View Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
