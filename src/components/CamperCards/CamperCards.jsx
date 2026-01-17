import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../features/favorites/favoritesSlice";

export default function CamperCard({ camper }) {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.ids);

  const isFav = favoriteIds.includes(String(camper.id));

  const handleToggleFav = () => {
    dispatch(toggleFavorite(camper.id));
  };

  return (
    <li
      style={{
        border: "1px solid #ddd",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>{camper.name}</h3>
          <p style={{ margin: "6px 0" }}>
            Price: {Number(camper.price).toFixed(2)}
          </p>
          <p style={{ margin: "6px 0" }}>Location: {camper.location}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* FAVORITE */}
          <button
            onClick={handleToggleFav}
            style={{ cursor: "pointer" }}
            aria-label="Toggle favorite"
          >
            {isFav ? "★ Favorited" : "☆ Add Favorite"}
          </button>

          {/* SHOW MORE (NEW TAB) */}
          <a
            href={`/catalog/${camper.id}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "6px 10px",
              border: "1px solid #333",
              borderRadius: 6,
              textDecoration: "none",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Show More
          </a>
        </div>
      </div>
    </li>
  );
}
