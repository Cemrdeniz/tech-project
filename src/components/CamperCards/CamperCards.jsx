import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../features/favorites/favoritesSlice";
import styles from "./CamperCards.module.css";

import { Link, useLocation } from "react-router-dom";

import HeartIcon from "../../assets/heart.svg";
import HeartedIcon from "../../assets/hearted.svg";

import PetrolIcon from "../../assets/petrol.png";
import AcIcon from "../../assets/ac.png";
import KitchenIcon from "../../assets/kitchen.png";
import TransmissionIcon from "../../assets/automatic.png";

function StarsLine({ rating = 0, reviewsCount = 0 }) {
  const r = Number(rating) || 0;
  return (
    <div className={styles.meta}>
      <span className={styles.star}>★</span>
      <span className={styles.rating}>
        {r.toFixed(1)}{" "}
        <span className={styles.reviews}>({reviewsCount} Reviews)</span>
      </span>
    </div>
  );
}

export default function CamperCard({ camper }) {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((s) => s.favorites.ids);
  const isFav = favoriteIds.includes(String(camper.id));
  const location = useLocation();

  const img =
    (Array.isArray(camper.gallery) &&
      (typeof camper.gallery[0] === "string"
        ? camper.gallery[0]
        : camper.gallery[0]?.original || camper.gallery[0]?.url)) ||
    "";

  return (
    <li className={styles.card}>
      <div className={styles.imgWrap}>
        {img ? (
          <img className={styles.img} src={img} alt={camper.name} />
        ) : (
          <div className={styles.imgFallback}>No image</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{camper.name}</h3>

          <div className={styles.priceFav}>
            <span className={styles.price}>
              €{Number(camper.price).toFixed(2)}
            </span>

            <button
              className={styles.favBtn}
              onClick={() => dispatch(toggleFavorite(camper.id))}
              aria-label="Toggle favorite"
              type="button"
            >
              <img
                src={isFav ? HeartedIcon : HeartIcon}
                alt=""
                className={styles.heartIcon}
              />
            </button>
          </div>
        </div>

        <div className={styles.subRow}>
          <StarsLine
            rating={camper.rating}
            reviewsCount={camper.reviews?.length || 0}
          />
          <div className={styles.location}>📍 {camper.location}</div>
        </div>

        <p className={styles.desc}>{camper.description || "—"}</p>

        <div className={styles.badges}>
          <span className={styles.badge}>
            <img src={TransmissionIcon} alt="" className={styles.badgeIcon} />
            <span>{camper.transmission || "—"}</span>
          </span>

          <span className={styles.badge}>
            <img src={PetrolIcon} alt="" className={styles.badgeIcon} />
            <span>{camper.engine || "—"}</span>
          </span>

          {camper.kitchen && (
            <span className={styles.badge}>
              <img src={KitchenIcon} alt="" className={styles.badgeIcon} />
              <span>Kitchen</span>
            </span>
          )}

          {camper.AC && (
            <span className={styles.badge}>
              <img src={AcIcon} alt="" className={styles.badgeIcon} />
              <span>AC</span>
            </span>
          )}
        </div>

        {/* ✅ SPA doğru navigation */}
        <Link
          className={styles.more}
          to={`/catalog/${camper.id}`}
          state={{ from: location }}
        >
          Show more
        </Link>
      </div>
    </li>
  );
}
