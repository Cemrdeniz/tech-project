import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCamperById } from "../../features/campers/campersSlice";
import { toggleFavorite } from "../../features/favorites/favoritesSlice";

function Stars({ value = 0 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.round(v);
  const stars = Array.from({ length: 5 }, (_, i) => (i < full ? "★" : "☆"));
  return <span aria-label={`Rating ${full} out of 5`}>{stars.join(" ")}</span>;
}

export default function CamperDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selected, selectedStatus, selectedError } = useSelector(
    (state) => state.campers
  );

  const favoriteIds = useSelector((state) => state.favorites.ids);
  const idStr = String(id);
  const isFav = favoriteIds.includes(idStr);

  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchCamperById(idStr));
  }, [dispatch, idStr, id]);

  useEffect(() => {
    setActiveImg(0);
  }, [selected?.id]);

  const images = useMemo(() => {
    const raw =
      selected?.gallery ??
      selected?.images ??
      selected?.photos ??
      selected?.image ??
      selected?.img ??
      selected?.photo ??
      [];

    if (!Array.isArray(raw)) return [];

    if (raw.every((x) => typeof x === "string")) return raw;

    return raw
      .map((x) => {
        if (!x) return null;
        if (typeof x === "string") return x;

        return (
          x.original ||
          x.url ||
          x.src ||
          x.large ||
          x.medium ||
          x.small ||
          x.thumb
        );
      })
      .filter(Boolean);
  }, [selected]);

  const handleToggleFav = () => {
    dispatch(toggleFavorite(idStr));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const date = String(formData.get("date") || "").trim();

    if (!name || !phone || !date) {
      alert("Please fill name, phone and date.");
      return;
    }

    alert("Reservation successful!");
    form.reset();
  };

  if (selectedStatus === "loading") return <p>Loading details...</p>;
  if (selectedStatus === "failed") return <p>Error: {selectedError}</p>;
  if (!selected) return <p>No data found.</p>;

  const activeSrc = images[activeImg];

  const priceNum = Number(selected.price);
  const priceText = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "—";

  return (
    <div style={{ padding: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{selected.name}</h1>

          <p style={{ margin: "6px 0" }}>
            <Stars value={selected.rating} />{" "}
            <span style={{ marginLeft: 8 }}>
              ({selected.reviews?.length || 0} reviews)
            </span>
          </p>

          <p style={{ margin: "6px 0" }}>Location: {selected.location}</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>
            €{priceText}
          </p>

          <button
            onClick={handleToggleFav}
            style={{ cursor: "pointer" }}
            type="button"
          >
            {isFav ? "★ Favorited" : "☆ Add Favorite"}
          </button>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      {/* Gallery */}
      <section>
        <h2>Gallery</h2>

        {images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div>
            <div style={{ marginBottom: 10 }}>
              {activeSrc ? (
                <img
                  src={activeSrc}
                  alt={`${selected.name} ${activeImg + 1}`}
                  style={{ maxWidth: "100%", borderRadius: 8 }}
                  onError={(e) => {
                    console.log("IMAGE FAILED:", activeSrc);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <p>No active image</p>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  onClick={() => setActiveImg(idx)}
                  style={{
                    cursor: "pointer",
                    border:
                      idx === activeImg ? "2px solid #333" : "1px solid #ddd",
                    padding: 2,
                    borderRadius: 6,
                    background: "transparent",
                  }}
                  aria-label={`Open image ${idx + 1}`}
                  type="button"
                >
                  <img
                    src={src}
                    alt={`thumb ${idx + 1}`}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      console.log("THUMB FAILED:", src);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <hr style={{ margin: "16px 0" }} />

      {/* Features & Details */}
      <section>
        <h2>Features</h2>
        <ul>
          <li>Transmission: {selected.transmission || "-"}</li>
          <li>Engine: {selected.engine || "-"}</li>
          <li>AC: {selected.AC ? "Yes" : "No"}</li>
          <li>Bathroom: {selected.bathroom ? "Yes" : "No"}</li>
          <li>Kitchen: {selected.kitchen ? "Yes" : "No"}</li>
          <li>TV: {selected.TV ? "Yes" : "No"}</li>
          <li>Radio: {selected.radio ? "Yes" : "No"}</li>
          <li>Refrigerator: {selected.refrigerator ? "Yes" : "No"}</li>
          <li>Microwave: {selected.microwave ? "Yes" : "No"}</li>
          <li>Gas: {selected.gas ? "Yes" : "No"}</li>
          <li>Water: {selected.water ? "Yes" : "No"}</li>
        </ul>

        <h2>Details</h2>
        <ul>
          <li>Form: {selected.form || "-"}</li>
          <li>Length: {selected.length || "-"}</li>
          <li>Width: {selected.width || "-"}</li>
          <li>Height: {selected.height || "-"}</li>
          <li>Tank: {selected.tank || "-"}</li>
          <li>Consumption: {selected.consumption || "-"}</li>
        </ul>
      </section>

      <hr style={{ margin: "16px 0" }} />

      {/* Reviews */}
      <section>
        <h2>Reviews</h2>

        {Array.isArray(selected.reviews) && selected.reviews.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {selected.reviews.map((rev, idx) => (
              <li
                key={`${rev.reviewer_name || "user"}-${idx}`}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{rev.reviewer_name || "Anonymous"}</strong>
                  <Stars value={rev.reviewer_rating} />
                </div>
                <p style={{ margin: "8px 0 0" }}>{rev.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews</p>
        )}
      </section>

      <hr style={{ margin: "16px 0" }} />

      {/* Booking Form */}
      <section>
        <h2>Book your camper</h2>

        <form onSubmit={handleBookingSubmit} style={{ maxWidth: 420 }}>
          <div style={{ marginBottom: 10 }}>
            <label>
              Name
              <input
                name="name"
                placeholder="Your name"
                style={{ width: "100%", padding: 8, display: "block" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Phone
              <input
                name="phone"
                placeholder="+90..."
                style={{ width: "100%", padding: 8, display: "block" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Date
              <input
                name="date"
                type="date"
                style={{ width: "100%", padding: 8, display: "block" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Comment
              <textarea
                name="comment"
                rows={4}
                placeholder="Optional"
                style={{ width: "100%", padding: 8, display: "block" }}
              />
            </label>
          </div>

          <button type="submit" style={{ cursor: "pointer" }}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
