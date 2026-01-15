import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampers } from "../../features/campers/campersSlice";

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.campers);
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    dispatch(
      fetchCampers({
        page: 1,
        limit: 4,
        filters,
      })
    );
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Catalog (Backend Test)</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} – {item.price}.00
          </li>
        ))}
      </ul>
    </div>
  );
}
