import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCamperById } from "../../features/campers/campersSlice";

import Header from "../../components/Header/Header";
import styles from "./CampersDetailsPage.module.css";

import PetrolIcon from "../../assets/petrol.png";
import AcIcon from "../../assets/ac.png";
import KitchenIcon from "../../assets/kitchen.png";
import TransmissionIcon from "../../assets/automatic.png";

import RadioIcon from "../../assets/ui-radios.svg";
import BathroomIcon from "../../assets/bathroom.png";

function Stars({ value = 0, className = "" }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.round(v);
  const stars = Array.from({ length: 5 }, (_, i) => (i < full ? "★" : "☆"));
  return (
    <span
      className={`${styles.stars} ${className}`}
      aria-label={`Rating ${full} out of 5`}
    >
      {stars.join(" ")}
    </span>
  );
}

export default function CamperDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selected, selectedStatus, selectedError } = useSelector(
    (state) => state.campers
  );

  const [tab, setTab] = useState("features");

  useEffect(() => {
    if (!id) return;
    dispatch(fetchCamperById(String(id)));
  }, [dispatch, id]);

  // header fixed ise padding-top ayarla
  useEffect(() => {
    const header = document.querySelector("header");
    const h = header?.offsetHeight || 88;
    document.documentElement.style.setProperty(
      "--header-offset",
      `${h + 20}px`
    );
    return () => {
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);

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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const date = String(formData.get("date") || "").trim();

    if (!name || !email || !date) {
      alert("Please fill name, email and date.");
      return;
    }

    alert("Reservation successful!");
    form.reset();
  };

  if (selectedStatus === "loading") return <p>Loading details...</p>;
  if (selectedStatus === "failed") return <p>Error: {selectedError}</p>;
  if (!selected) return <p>No data found.</p>;

  const priceNum = Number(selected.price);
  const priceText = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "—";
  const reviewsCount = selected.reviews?.length || 0;

  // 3 foto göster
  const gallerySlots = Array.from({ length: 3 }, (_, i) => images[i] || null);

  return (
    <>
      <Header />

      <div className={styles.page}>
        <div className={styles.container}>
          {/* TOP */}
          <div className={styles.top}>
            <div>
              <h1 className={styles.title}>{selected.name}</h1>

              <div className={styles.metaRow}>
                <span className={styles.starLine}>
                  <Stars value={selected.rating} />
                  <span className={styles.reviewsCount}>
                    ({reviewsCount} Reviews)
                  </span>
                </span>

                <span className={styles.location}>📍 {selected.location}</span>
              </div>

              <p className={styles.priceInline}>€{priceText}</p>
            </div>
          </div>

          <div className={styles.hr} />

          {/* GALLERY */}
          <section className={styles.gallerySection} aria-label="Gallery">
            <div className={styles.galleryGrid3}>
              {gallerySlots.map((src, idx) => (
                <div
                  className={styles.galleryItem}
                  key={`${src || "slot"}-${idx}`}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`${selected.name} ${idx + 1}`}
                      className={styles.galleryImg}
                      onError={(e) => {
                        console.log("IMAGE FAILED:", src);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={styles.galleryPlaceholder} />
                  )}
                </div>
              ))}
            </div>

            <p className={styles.galleryDesc}>{selected.description || "—"}</p>
          </section>

          {/* TABS */}
          <div className={styles.tabs} role="tablist" aria-label="Details tabs">
            <button
              type="button"
              className={`${styles.tabBtn} ${
                tab === "features" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setTab("features")}
              role="tab"
              aria-selected={tab === "features"}
            >
              Features
            </button>

            <button
              type="button"
              className={`${styles.tabBtn} ${
                tab === "reviews" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setTab("reviews")}
              role="tab"
              aria-selected={tab === "reviews"}
            >
              Reviews
            </button>
          </div>

          {/* CONTENT */}
          {tab === "features" ? (
            <div className={styles.contentGrid}>
              {/* LEFT */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Features</h3>

                <div className={styles.badges}>
                  <span className={styles.badge}>
                    <img
                      src={TransmissionIcon}
                      alt=""
                      className={styles.badgeIcon}
                    />
                    <span className={styles.badgeText}>
                      {selected.transmission || "—"}
                    </span>
                  </span>

                  <span className={styles.badge}>
                    <img src={PetrolIcon} alt="" className={styles.badgeIcon} />
                    <span className={styles.badgeText}>
                      {selected.engine || "—"}
                    </span>
                  </span>

                  {selected.kitchen && (
                    <span className={styles.badge}>
                      <img
                        src={KitchenIcon}
                        alt=""
                        className={styles.badgeIcon}
                      />
                      <span className={styles.badgeText}>Kitchen</span>
                    </span>
                  )}

                  {selected.AC && (
                    <span className={styles.badge}>
                      <img src={AcIcon} alt="" className={styles.badgeIcon} />
                      <span className={styles.badgeText}>AC</span>
                    </span>
                  )}

                  {selected.radio && (
                    <span className={styles.badge}>
                      <img
                        src={RadioIcon}
                        alt=""
                        className={styles.badgeIcon}
                      />
                      <span className={styles.badgeText}>Radio</span>
                    </span>
                  )}

                  {selected.bathroom && (
                    <span className={styles.badge}>
                      <img
                        src={BathroomIcon}
                        alt=""
                        className={styles.badgeIcon}
                      />
                      <span className={styles.badgeText}>Bathroom</span>
                    </span>
                  )}
                </div>

                <h3 className={styles.cardTitle}>Vehicle details</h3>
                <div className={styles.vehicleDivider} />

                <table className={styles.detailsTable}>
                  <tbody>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Form</td>
                      <td className={styles.detailsCellVal}>
                        {selected.form || "-"}
                      </td>
                    </tr>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Length</td>
                      <td className={styles.detailsCellVal}>
                        {selected.length || "-"}
                      </td>
                    </tr>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Width</td>
                      <td className={styles.detailsCellVal}>
                        {selected.width || "-"}
                      </td>
                    </tr>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Height</td>
                      <td className={styles.detailsCellVal}>
                        {selected.height || "-"}
                      </td>
                    </tr>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Tank</td>
                      <td className={styles.detailsCellVal}>
                        {selected.tank || "-"}
                      </td>
                    </tr>
                    <tr className={styles.detailsRow}>
                      <td className={styles.detailsCellKey}>Consumption</td>
                      <td className={styles.detailsCellVal}>
                        {selected.consumption || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RIGHT BOOKING */}
              <aside className={styles.bookingCard}>
                <h3 className={styles.bookingTitle}>Book your campervan now</h3>
                <p className={styles.bookingSub}>
                  Stay connected! We are always ready to help you.
                </p>

                <form onSubmit={handleBookingSubmit}>
                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="name"
                      placeholder="Name*"
                    />
                  </div>

                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="email"
                      type="email"
                      placeholder="Email*"
                    />
                  </div>

                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="date"
                      placeholder="Booking date*"
                    />
                  </div>

                  <div className={styles.field}>
                    <textarea
                      className={styles.textareaSoft}
                      name="comment"
                      rows={4}
                      placeholder="Comment"
                    />
                  </div>

                  <button type="submit" className={styles.sendBtnBig}>
                    Send
                  </button>
                </form>
              </aside>
            </div>
          ) : (
            <div className={styles.contentGridReviews}>
              <div className={styles.reviewsWrap}>
                {Array.isArray(selected.reviews) &&
                selected.reviews.length > 0 ? (
                  <ul className={styles.reviewListModern}>
                    {selected.reviews.map((rev, idx) => {
                      const name = rev.reviewer_name || "Anonymous";
                      const initial =
                        name.trim().charAt(0).toUpperCase() || "A";

                      return (
                        <li key={`${name}-${idx}`} className={styles.reviewRow}>
                          <div className={styles.avatar}>{initial}</div>

                          <div className={styles.reviewBody}>
                            <div className={styles.reviewHeader}>
                              <div className={styles.reviewName}>{name}</div>
                              <Stars
                                value={rev.reviewer_rating}
                                className={styles.starsSmall}
                              />
                            </div>

                            <p className={styles.reviewComment}>
                              {rev.comment}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No reviews</p>
                )}
              </div>

              <aside className={styles.bookingCard}>
                <h3 className={styles.bookingTitle}>Book your campervan now</h3>
                <p className={styles.bookingSub}>
                  Stay connected! We are always ready to help you.
                </p>

                <form onSubmit={handleBookingSubmit}>
                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="name"
                      placeholder="Name*"
                    />
                  </div>

                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="email"
                      type="email"
                      placeholder="Email*"
                    />
                  </div>

                  <div className={styles.field}>
                    <input
                      className={styles.inputSoft}
                      name="date"
                      placeholder="Booking date*"
                    />
                  </div>

                  <div className={styles.field}>
                    <textarea
                      className={styles.textareaSoft}
                      name="comment"
                      rows={4}
                      placeholder="Comment"
                    />
                  </div>

                  <button type="submit" className={styles.sendBtnBig}>
                    Send
                  </button>
                </form>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
