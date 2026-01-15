import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCampers, getCamperById } from "../../api/campersApi";

/**
 * LIST: /campers
 * DETAILS: /campers/:id
 */

export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async ({ page, limit, filters }, thunkAPI) => {
    try {
      const params = { page, limit };

      // Backend filtering (query params)
      if (filters?.location) params.location = filters.location;
      if (filters?.form) params.form = filters.form;

      if (filters?.features) {
        Object.entries(filters.features).forEach(([key, value]) => {
          if (value === true) params[key] = true;
        });
      }

      const data = await getCampers(params);
      // Beklenen format: { total, items }
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Request failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchCamperById = createAsyncThunk(
  "campers/fetchCamperById",
  async (id, thunkAPI) => {
    try {
      const data = await getCamperById(id);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Request failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  // Catalog list
  items: [],
  total: 0,
  page: 1,
  limit: 4,

  status: "idle", // idle | loading | succeeded | failed
  error: null,

  // Details
  selected: null,
  selectedStatus: "idle", // idle | loading | succeeded | failed
  selectedError: null,
};

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    resetList(state) {
      // Filtre değişince bunu çağıracağız
      state.items = [];
      state.total = 0;
      state.page = 1;
      state.status = "idle";
      state.error = null;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchCampers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { items, total } = action.payload || { items: [], total: 0 };

        // state.page değerine göre replace/append
        if (state.page === 1) {
          state.items = items;
        } else {
          state.items = [...state.items, ...items];
        }

        state.total = total;
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Request failed";
      })

      // DETAILS
      .addCase(fetchCamperById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Request failed";
      });
  },
});

export const { resetList, setPage, setLimit, clearSelected } =
  campersSlice.actions;

export default campersSlice.reducer;
