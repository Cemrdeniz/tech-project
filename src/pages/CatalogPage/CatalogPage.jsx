import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers, setPage } from "../../features/campers/campersSlice";
import CatalogFilters from "../../components/Filters/Filters";
import CamperCard from "../../components/CamperCards/CamperCards";
import styles from "./CatalogPage.module.css";

export default function CatalogPage() {
  const dispatch = useDispatch();

  const { items, total, page, limit, status, error } = useSelector(
    (state) => state.campers
  );
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    dispatch(fetchCampers({ page, limit, filters }));
  }, [dispatch, page, limit, filters]);

  const canLoadMore = items.length < total;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* LEFT: Filters */}
        <aside className={styles.sidebar}>
          <CatalogFilters />
        </aside>

        {/* RIGHT: List */}
        <section className={styles.main}>
          {status === "failed" && <p className={styles.error}>Error: {error}</p>}

          <ul className={styles.list}>
            {items.map((camper) => (
              <CamperCard key={camper.id} camper={camper} />
            ))}
          </ul>

          <div className={styles.footer}>
            {status === "loading" && page === 1 && (
              <p className={styles.loading}>Loading...</p>
            )}

            {canLoadMore && (
              <button
                className={styles.loadMore}
                onClick={() => dispatch(setPage(page + 1))}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
