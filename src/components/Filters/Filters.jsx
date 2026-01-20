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

/* ===== KEYS ===== */
const EQUIPMENT_KEYS = ["AC", "kitchen", "TV", "bathroom", "automatic"];
const TYPE_KEYS = ["Van", "fullyIntegrated", "alcove"];

/* ===== ICON MAPS ===== */
const EQUIPMENT_ICONS = {
  AC: AcIcon,
  kitchen: KitchenIcon,
  TV: TvIcon,
  bathroom: BathIcon,
  automatic: AutoIcon,
};

const TYPE_ICONS = {
  Van: VanIcon,
  fullyIntegrated: FullyIcon,
  alcove: AlcoveIcon,
};

export default function Filters() {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.filters);

  const [location, setLocation] = useState(current.location || "");
  const [equipment, setEquipment] = useState(() => ({
    AC: !!current.features?.AC,
    kitchen: !!current.features?.kitchen,
    TV: !!current.features?.TV,
    bathroom: !!current.features?.bathroom,
    automatic: !!current.features?.automatic,
  }));
  const [type, setType] = useState(current.form || "");

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

  const toggleEquip = (key) => {
    setEquipment((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    dispatch(
      setFilters({
        location,
        form: type,
        features: featurePayload,
      })
    );
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
          {EQUIPMENT_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => toggleEquip(k)}
              className={`${styles.tile} ${equipment[k] ? styles.active : ""}`}
            >
              <span className={styles.tileIcon}>
                <img
                  src={EQUIPMENT_ICONS[k]}
                  alt=""
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.tileText}>{k}</span>
            </button>
          ))}
        </div>

        {/* TYPE */}
        <h4 className={styles.h4}>Vehicle type</h4>
        <div className={styles.grid}>
          {TYPE_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              className={`${styles.tile} ${type === k ? styles.active : ""}`}
            >
              <span className={styles.tileIcon}>
                <img
                  src={TYPE_ICONS[k]}
                  alt=""
                  className={styles.iconImg}
                />
              </span>
              <span className={styles.tileText}>
                {k === "fullyIntegrated" ? "Fully Integrated" : k}
              </span>
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
