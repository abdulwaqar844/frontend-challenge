import { openDB } from "idb";

const DB_NAME = "photoGalleryDB";
const STORE_NAME = "photos";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Save a photo
export const savePhotoToDB = async (photo , favorite=false , title ='') => {
  const db = await initDB();
  return db.add(STORE_NAME, { id: Date.now(), photo , favorite, title });
};

// Retrieve paginated photos sorted by ID 
export const getPhotosFromDB = async (page = 1, count = 4) => {
  const db = await initDB();
  const allPhotos = await db.getAll(STORE_NAME);
  
  // Sort by ID 
  allPhotos.sort((a, b) => b.id - a.id);

  // Paginate results
  const startIndex = (page - 1) * count;
  const paginatedPhotos = allPhotos.slice(startIndex, startIndex + count);

  return {
    photos: paginatedPhotos,
    totalPhotos: allPhotos.length,
  };
};
// Delete photo from IndexedDB
export const deletePhotoFromDB = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};
// update photo property favorite
export const updateFavoritePhoto = async (id, favorite) => {
  const db = await initDB();
  // Get the existing photo object
  const photoObj = await db.get(STORE_NAME, id);
  if (!photoObj) return null;
  
  // Update only the favorite property
  photoObj.favorite = favorite;
  
  // Save the updated object back to the database
  return db.put(STORE_NAME, photoObj);
};