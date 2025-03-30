import { useEffect, useRef, useState } from "react";

const VideoThumbnail = ({ videoSrc, onClick }) => {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const captureThumbnail = () => {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      video.currentTime = 1; // Capture at 1 second

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/png")); // Convert to base64
      };
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", captureThumbnail);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", captureThumbnail);
      }
    };
  }, [videoSrc]);

  return (
    <div className="small-img-col">
      
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          
          onClick={onClick}
        />
      ) : (
        <div className="loader3"></div>
      )}
      <video crossorigin="anonymous" ref={videoRef} style={{ display: "none" }}>
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoThumbnail;
