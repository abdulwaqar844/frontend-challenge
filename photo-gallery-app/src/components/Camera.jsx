import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addPhotoAndFetch } from "../redux/photoSlice";

const Camera = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      setStream(userStream);
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError(err.message);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL("image/png");
      dispatch(addPhotoAndFetch(photoData)); // Save to Redux & IndexedDB
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-1">
      {!stream && (
        <button
          className="bg-blue-950 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded "
          onClick={startCamera}
        >
          Start Camera
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <div className="py-4 space-x-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            maxWidth: "640px",
            borderRadius: "8px",
            display: stream ? "block" : "none",
          }}
        ></video>

        {stream && (
          <div className="py-4 md:py-6 sm:space-y-2 md:space-y-0 px-4 flex sm:flex-row flex-col justify-center items-center gap-2">
            <button
              className="bg-red-800 hover:bg-red-600  text-white font-bold py-2 px-4 rounded w-32"
              onClick={stopCamera}
            >
              Stop Camera
            </button>
            <button
              onClick={capturePhoto}
              className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32"
            >
              Take Photo
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default Camera;
