import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../features/filters/filtersSlice";
import { resetList, setPage } from "../../features/campers/campersSlice";
import styles from "./Filters.module.css";

/* ===== ICONS ===== */
import VanIcon from "../../assets/van.png";
import FullyIcon from "../../assets/fully.png";
import AlcoveIcon from "../../assets/alcove.png";

import AcIcon from "../../assets/ac.png";
import KitchenIcon from "../../assets/kitchen.png";
import TvIcon from "../../assets/tv.png";
import BathIcon from "../../assets/bathroom.png";
import AutoIcon from "../../assets/automatic.png";

/* ===== OPTIONS ===== */

// backend keys ile birebir
const EQUIPMENT_OPTIONS = [
  { key: "AC", label: "AC", icon: AcIcon },
  { key: "kitchen", label: "Kitchen", icon: KitchenIcon },
  { key: "TV", label: "TV", icon: TvIcon },
  { key: "bathroom", label: "Bathroom", icon: BathIcon },
  { key: "automatic", label: "Automatic", icon: AutoIcon },
];

const TYPE_OPTIONS = [
  { key: "van", label: "Van", icon: VanIcon },
  { key: "fullyIntegrated", label: "Fully Integrated", icon: FullyIcon },
  { key: "alcove", label: "Alcove", icon: AlcoveIcon },
];

export default function Filters() {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.filters);

  /* ===== STATE ===== */
  const [location, setLocation] = useState(current.location || "");

  const [equipment, setEquipment] = useState(() => ({
    AC: !!current.features?.AC,
    kitchen: !!current.features?.kitchen,
    TV: !!current.features?.TV,
    bathroom: !!current.features?.bathroom,
    automatic: !!current.features?.automatic,
  }));

  const [type, setType] = useState(current.form || "");

  /* ===== PAYLOAD ===== */
  const featurePayload = useMemo(() => {
    return {
      AC: !!equipment.AC,
      kitchen: !!equipment.kitchen,
      TV: !!equipment.TV,
      bathroom: !!equipment.bathroom,
      automatic: !!equipment.automatic,
      radio: !!current.features?.radio,
      refrigerator: !!current.features?.refrigerator,
      microwave: !!current.features?.microwave,
      gas: !!current.features?.gas,
      water: !!current.features?.water,
    };
  }, [equipment, current.features]);

  /* ===== ACTIONS ===== */
  const toggleEquip = (key) => {
    setEquipment((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    const payload = {
      location,
      form: type, // ✅ "van" | "alcove" | "fullyIntegrated"
      features: featurePayload,
    };

    console.log("FILTER PAYLOAD:", payload);

    dispatch(setFilters(payload));
    dispatch(resetList());
    dispatch(setPage(1));
  };

  return (
    <div className={styles.box}>
      {/* LOCATION */}
      <div className={styles.block}>
        <p className={styles.label}>Location</p>
        <div className={styles.inputWrap}>
          <span className={styles.pin}>📍</span>
          <input
            className={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Kyiv, Ukraine"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.block}>
        <p className={styles.label}>Filters</p>

        {/* EQUIPMENT */}
        <h4 className={styles.h4}>Vehicle equipment</h4>
        <div className={`${styles.grid} ${styles.gridWithDivider}`}>
          {EQUIPMENT_OPTIONS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleEquip(key)}
              className={`${styles.tile} ${
                equipment[key] ? styles.active : ""
              }`}
            >
              <span className={styles.tileIcon}>
                <img src={icon} alt="" className={styles.iconImg} />
              </span>
              <span className={styles.tileText}>{label}</span>
            </button>
          ))}
        </div>

        {/* TYPE */}
        <h4 className={styles.h4}>Vehicle type</h4>
        <div className={styles.grid}>
          {TYPE_OPTIONS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={`${styles.tile} ${
                type === key ? styles.active : ""
              }`}
            >
              <span className={styles.tileIcon}>
                <img src={icon} alt="" className={styles.iconImg} />
              </span>
              <span className={styles.tileText}>{label}</span>
            </button>
          ))}
        </div>

        <button className={styles.searchBtn} onClick={handleApply}>
          Search
        </button>
      </div>
    </div>
  );
}
