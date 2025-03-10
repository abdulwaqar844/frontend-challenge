import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPhotos,
  setPage,
  deletePhotoAndFetch,
  changeFavoriteAndFetch,
} from "../redux/photoSlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const { photos, currentPage, itemsPerPage, totalPhotos } = useSelector(
    (state) => state.photos
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  useEffect(() => {
    dispatch(fetchPhotos({ page: currentPage, count: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalPhotos / itemsPerPage);

  return (
    <div className="flex flex-col p-1 w-full h-full items-center justify-center">
      <h2 className="text-white text-center text-2xl">Photo Gallery</h2>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {photos.map((photo) => (
          <div className="relative" key={photo.id}>
            <img
              src={photo.photo}
              alt="Captured"
              className="w-56 rounded-lg shadow-md cursor-pointer"
              onClick={() => setSelectedPhoto(photo.photo)}
            />
            <div className="absolute top-0 right-0">
              <button
                onClick={() =>
                  dispatch(
                    changeFavoriteAndFetch({
                      id: photo.id,
                      favorite: !photo.favorite,
                    })
                  )
                }
                className="bg-red-900 text-white p-2 rounded mt-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={
                    photo.favorite ? "green" : "black"
                  }
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-4 `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => dispatch(deletePhotoAndFetch(photo.id))}
                className="bg-red-900 text-white p-2 rounded mt-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => dispatch(setPage(currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
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
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
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
