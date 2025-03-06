import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPhotos, setPage } from "../redux/photoSlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const { photos, currentPage, itemsPerPage, totalPhotos } = useSelector(
    (state) => state.photos
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ✅ Always fetch latest photos when page changes
  useEffect(() => {
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalPhotos / itemsPerPage);

  return (
    <div className="flex flex-col p-1 w-full h-full items-center justify-center">
      <h2 className="text-white text-center text-2xl">Photo Gallery</h2>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.photo}
            alt="Captured"
            className="w-56 rounded-lg shadow-md cursor-pointer"
            onClick={() => setSelectedPhoto(photo.photo)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => dispatch(setPage(currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 mx-1 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>

        <span className="p-2 mx-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => dispatch(setPage(currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 mx-1 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Zoomed Image Dialog */}
      {selectedPhoto && (
        <div
          className="px-4 fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Zoomed"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
