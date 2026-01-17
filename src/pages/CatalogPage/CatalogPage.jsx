import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers, setPage } from "../../features/campers/campersSlice";
import Filters from "../../components/Filters/Filters";
import CamperCard from "../../components/CamperCards/CamperCards";

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

  const handleLoadMore = () => {
    dispatch(setPage(page + 1));
  };

  return (
    <div>
      <h1>Catalog</h1>

      <Filters />

      {status === "loading" && page === 1 && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((camper) => (
          <CamperCard key={camper.id} camper={camper} />
        ))}
      </ul>

      {canLoadMore && (
        <button onClick={handleLoadMore} disabled={status === "loading"} style={{ cursor: "pointer" }}>
          {status === "loading" ? "Loading..." : "Load More"}
        </button>
      )}

      {!canLoadMore && status === "succeeded" && items.length > 0 && (
        <p>All items loaded.</p>
      )}
    </div>
  );
}
