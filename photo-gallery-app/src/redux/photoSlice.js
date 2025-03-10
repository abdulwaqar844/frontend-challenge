import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { savePhotoToDB, getPhotosFromDB, deletePhotoFromDB, updateFavoritePhoto } from "../utils/indexedDB";

// Async action to fetch paginated photos
export const fetchPhotos = createAsyncThunk(
  "photos/fetchPhotos",
  async ({ page, count }) => {
    return await getPhotosFromDB(page, count);
  }
);

//  Save photo and then fetch updated photos
export const addPhotoAndFetch = createAsyncThunk(
  "photos/addPhotoAndFetch",
  async (photo, { dispatch, getState }) => {
    await savePhotoToDB(photo); // Save to IndexedDB

    //  Fetch updated photos list
    const { currentPage, itemsPerPage } = getState().photos;
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }
);
export const deletePhotoAndFetch = createAsyncThunk(
  "photos/deletePhotoAndFetch",
  async (id, { dispatch, getState }) => {
    await deletePhotoFromDB(id); // Delete from IndexedDB

    // Fetch updated photos list
    const { currentPage, itemsPerPage } = getState().photos;
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }
);
// slice to update photos state
export const changeFavoriteAndFetch = createAsyncThunk(
  "photos/updatePhotoAndFetch",
  async ({ id, favorite }, { dispatch, getState }) => {
    await updateFavoritePhoto(id, favorite); // Update IndexedDB

    // Fetch updated photos list
    const { currentPage, itemsPerPage } = getState().photos;
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }
);


const photoSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
    totalPhotos: 0,
    currentPage: 1,
    itemsPerPage: 6,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPhotos.fulfilled, (state, action) => {
      state.photos = action.payload.photos;
      state.totalPhotos = action.payload.totalPhotos;
    });
  },
});

export const { setPage } = photoSlice.actions;
export default photoSlice.reducer;
