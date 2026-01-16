import Header from "../../components/Layout/Layout";
import styles from "./HomePage.module.css";
import heroImg from "../../assets/hero.jpg";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header />

      <main
        className={styles.hero}
        style={{ "--hero": `url(${heroImg})` }}
      >
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Campers of your dreams</h1>
            <p className={styles.text}>
              You can find everything you want in our catalog
            </p>
            <a className={styles.button} href="/catalog">
              View Now
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
