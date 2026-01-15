import { useParams } from "react-router-dom";

export default function CamperDetailsPage() {
  const { id } = useParams();
  return <h1>Details: {id}</h1>;
}
