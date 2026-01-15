import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCamperById } from "../../features/campers/campersSlice";

export default function CamperDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, selectedStatus } = useSelector(
    (state) => state.campers
  );

  useEffect(() => {
    dispatch(fetchCamperById(id));
  }, [dispatch, id]);

  if (selectedStatus === "loading") return <p>Loading...</p>;
  if (!selected) return <p>No data</p>;

  return (
    <div>
      <h1>{selected.name}</h1>
      <p>Price: {selected.price}.00</p>
      <p>Location: {selected.location}</p>
    </div>
  );
}
