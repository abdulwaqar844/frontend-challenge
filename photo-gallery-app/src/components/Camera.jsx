import React, { useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Cropper from "react-easy-crop";
import { addPhotoAndFetch } from "../redux/photoSlice";

const Camera = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
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
      if (videoRef.current) videoRef.current.srcObject = null;
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
      setCapturedImage(photoData);
      setShowCropper(true);
      stopCamera();
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const savePhoto = async () => {
    if (capturedImage && croppedAreaPixels) {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = capturedImage;
      image.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        const croppedData = canvas.toDataURL("image/png");
        dispatch(addPhotoAndFetch(croppedData));
        setCapturedImage(null);
        setShowCropper(false);
        startCamera();
      };
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    setShowCropper(false);
    startCamera();
  };

  const toggleCamera = async () => {
    setFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
    if (stream) {
      stopCamera();
    }
    await startCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-md mx-auto">

      {!stream && !capturedImage && (
        <button className="bg-blue-950 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded" onClick={startCamera}>
          Start Camera
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!capturedImage && (
        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "auto", display: stream ? "block" : "none" }}></video>
      )}

      {capturedImage && showCropper && (
        <div className="relative w-full h-96">
          <Cropper image={capturedImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
        </div>
      )}

      {capturedImage && (
        <div className="py-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-32" onClick={discardPhoto}>
            Discard
          </button>
          <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-32" onClick={savePhoto}>
            Save
          </button>
        </div>
      )}

      {stream && !capturedImage && (
        <div className="py-4 w-full flex flex-col sm:flex-row justify-center items-center gap-2">
          <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full sm:w-32" onClick={stopCamera}>
            Stop Camera
          </button>
          <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full sm:w-32" onClick={capturePhoto}>
            Take Photo
          </button>
          <button className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded w-full sm:w-40" onClick={toggleCamera}>
            Switch Camera
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default Camera;
