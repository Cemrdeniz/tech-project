import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampers,
  setPage,
  resetList,
} from "../../features/campers/campersSlice";
import CatalogFilters from "../../components/Filters/Filters";
import CamperCard from "../../components/CamperCards/CamperCards";
import styles from "./CatalogPage.module.css";

export default function CatalogPage() {
  const dispatch = useDispatch();

  const { items, total, page, limit, status, error } = useSelector(
    (state) => state.campers
  );
  const filters = useSelector((state) => state.filters);

  const filtersSig = useMemo(() => JSON.stringify(filters), [filters]);

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  const FORM_MAP = {
    van: ["van", "paneltruck", "panel truck", "panel_truck"],
    fullyintegrated: ["fullyintegrated", "fully integrated", "integrated"],
    alcove: ["alcove"],
  };

  const isFilterActive = useMemo(() => {
    const hasLocation = Boolean(filters.location);
    const hasForm = Boolean(filters.form);
    const hasAuto = Boolean(filters.features?.automatic);
    const hasOtherFeatures = Object.entries(filters.features || {}).some(
      ([k, v]) => k !== "automatic" && v === true
    );
    return hasLocation || hasForm || hasAuto || hasOtherFeatures;
  }, [filters]);

  // ✅ Filtre değişince listeyi sıfırla + 1. sayfaya dön
  useEffect(() => {
    dispatch(resetList());
    dispatch(setPage(1));
  }, [dispatch, filtersSig]);

  // ✅ Sayfa/limit/filters değişince fetch
  useEffect(() => {
    dispatch(fetchCampers({ page, limit, filters }));
  }, [dispatch, page, limit, filtersSig, filters]);

  // ✅ Client-side filtrelenmiş liste
  const visibleItems = useMemo(() => {
    let list = items;

    // FORM (van / fullyIntegrated / alcove)
    if (filters.form) {
      const wanted = normalize(filters.form);
      const aliases = FORM_MAP[wanted] ?? [wanted];

      list = list.filter((c) => {
        const candidates = [
          c.form,
          c.type,
          c.vehicleType,
          c.vehicle_type,
          c.name,
          c.details?.form,
          c.details?.type,
          c.details?.vehicleType,
        ].map(normalize);

        return candidates.some((val) =>
          aliases.some((a) => val.includes(normalize(a)))
        );
      });
    }

    // AUTOMATIC
    if (filters.features?.automatic) {
      list = list.filter((c) => {
        const transmission = normalize(
          c.transmission ?? c.details?.transmission ?? c.gearbox
        );
        return transmission.includes("automatic") || transmission.includes("auto");
      });
    }

    return list;
  }, [items, filters.form, filters.features?.automatic]);

  // ✅ Load more her zaman server total'a göre
  const canLoadMore = items.length < total;

  // ✅ AUTO-FILL: Filtre aktif + ekranda kart yoksa => otomatik sonraki sayfayı çek
  // Böylece filtrelediğinde "sadece Load more" görünmez, kartlar gelene kadar otomatik doldurur.
  useEffect(() => {
    const isLoading = status === "loading";
    const hasNoVisible = visibleItems.length === 0;
    const hasMoreServerData = items.length < total;

    if (isFilterActive && !isLoading && hasNoVisible && hasMoreServerData) {
      dispatch(setPage(page + 1));
    }
  }, [
    dispatch,
    isFilterActive,
    status,
    visibleItems.length,
    items.length,
    total,
    page,
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <CatalogFilters />
        </aside>

        <section className={styles.main}>
          {status === "failed" && <p className={styles.error}>Error: {error}</p>}

          <ul className={styles.list}>
            {visibleItems.map((camper) => (
              <CamperCard key={camper.id} camper={camper} />
            ))}
          </ul>

          <div className={styles.footer}>
            {status === "loading" && page === 1 && (
              <p className={styles.loading}>Loading...</p>
            )}

            {/* ✅ Filtre varken de her zaman Load more görünsün */}
            {canLoadMore && (
              <button
                className={styles.loadMore}
                onClick={() => dispatch(setPage(page + 1))}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Loading..." : "Load more"}
              </button>
            )}

            {/* ✅ Veri bitti ve hala yoksa */}
            {status === "succeeded" && !canLoadMore && visibleItems.length === 0 && (
              <p className={styles.loading}>No campers found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
