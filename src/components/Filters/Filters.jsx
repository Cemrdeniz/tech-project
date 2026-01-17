import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../features/filters/filtersSlice";
import { resetList, setPage, fetchCampers } from "../../features/campers/campersSlice";

export default function Filters() {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state) => state.filters);
  const limit = useSelector((state) => state.campers.limit);

  // Local state: kullanıcı yazarken hemen fetch atmayacağız
  const [location, setLocation] = useState(currentFilters.location);
  const [form, setForm] = useState(currentFilters.form);
  const [features, setFeatures] = useState({ ...currentFilters.features });

  const toggleFeatureLocal = (key) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    const nextFilters = { location, form, features };

    // 1) global filtreleri güncelle
    dispatch(setFilters(nextFilters));

    // 2) eski sonuçları temizle (KRİTİK)
    dispatch(resetList());

    // 3) sayfayı 1'e çek
    dispatch(setPage(1));

    // 4) backend'e yeni filtrelerle fetch
    dispatch(fetchCampers({ page: 1, limit, filters: nextFilters }));
  };

  const handleClear = () => {
    const cleared = {
      location: "",
      form: "",
      features: {
        AC: false,
        kitchen: false,
        bathroom: false,
        TV: false,
        radio: false,
        refrigerator: false,
        microwave: false,
        gas: false,
        water: false,
      },
    };

    setLocation("");
    setForm("");
    setFeatures(cleared.features);

    dispatch(setFilters(cleared));
    dispatch(resetList());
    dispatch(setPage(1));
    dispatch(fetchCampers({ page: 1, limit, filters: cleared }));
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", marginBottom: 16 }}>
      <h3>Filters (Backend)</h3>

      <div style={{ marginBottom: 8 }}>
        <label>
          Location:&nbsp;
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Kyiv"
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          Vehicle Type (form):&nbsp;
          <select value={form} onChange={(e) => setForm(e.target.value)}>
            <option value="">All</option>
            <option value="panelTruck">panelTruck</option>
            <option value="fullyIntegrated">fullyIntegrated</option>
            <option value="alcove">alcove</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div>Features:</div>
        {Object.keys(features).map((key) => (
          <label key={key} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              checked={features[key]}
              onChange={() => toggleFeatureLocal(key)}
            />
            &nbsp;{key}
          </label>
        ))}
      </div>

      <button onClick={handleApply} style={{ marginRight: 8, cursor: "pointer" }}>
        Apply
      </button>
      <button onClick={handleClear} style={{ cursor: "pointer" }}>
        Clear
      </button>
    </div>
  );
}
