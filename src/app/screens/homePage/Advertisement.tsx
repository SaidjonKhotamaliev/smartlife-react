import React from "react";

export default function Advertisement() {
  return (
    <div className="ads-restaurant-frame">
      <video
        className="ads-video"
        autoPlay={true}
        loop
        muted
        playsInline
        data-video-mdeia=""
      >
        <source type="video/mp4" src="video/apple-ads.mp4" />
      </video>
    </div>
  );
}
