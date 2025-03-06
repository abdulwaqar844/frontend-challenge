import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPhotos, setPage } from "../redux/photoSlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const { photos, currentPage, itemsPerPage, totalPhotos } = useSelector(
    (state) => state.photos
  );

  // ✅ Always fetch latest photos when page changes
  useEffect(() => {
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalPhotos / itemsPerPage);

  return (
    <div className="flex flex-col  p-1 w-full  h-full items-center justify-center">
      <h2 className="text-white text-center text-2xl ">Photo Gallery</h2>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.photo}
            alt="Captured"
            className="w-56 rounded-lg shadow-md"
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
    </div>
  );
};

export default Gallery;
