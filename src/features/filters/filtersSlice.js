import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: "",
  form: "", // vehicle type: tek seçim (örn: "panelTruck", "fullyIntegrated"...)
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

    // ✅ bunu ekle
    automatic: false,
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setForm(state, action) {
      state.form = action.payload;
    },
    toggleFeature(state, action) {
      const key = action.payload;
      if (Object.prototype.hasOwnProperty.call(state.features, key)) {
        state.features[key] = !state.features[key];
      }
    },
    setFilters(state, action) {
      const next = action.payload;
      state.location = next.location ?? "";
      state.form = next.form ?? "";
      state.features = next.features ?? { ...initialState.features };
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setLocation, setForm, toggleFeature, setFilters, resetFilters } =
  filtersSlice.actions;

export default filtersSlice.reducer;
