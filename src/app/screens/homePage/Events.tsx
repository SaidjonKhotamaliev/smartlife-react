import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { plans } from "../../../lib/data/plans";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  return (
    <div className="events-frame">
      <Stack className="events-main">
        <Box className="events-text"></Box>

        <Swiper
          className="events-info swiper-wrapper"
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
        >
          {plans.map((value, number) => {
            // Extract the video ID from the YouTube URL
            let videoId = value.videoUrl.split("v=")[1];
            const ampersandPosition = videoId?.indexOf("&");
            if (ampersandPosition !== -1) {
              videoId = videoId?.substring(0, ampersandPosition);
            }
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <SwiperSlide key={number} className="events-info-frame">
                <div className="events-img">
                  <a
                    href={value.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={thumbnailUrl}
                      className="events-img"
                      alt={value.title}
                    />
                  </a>
                </div>
                <Box className="events-desc">
                  <Box className="events-bott">
                    <Box className="bott-left">
                      <div className="event-title-speaker">
                        <strong>{value.title}</strong>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className="prev-next-frame">
          <img
            src="/icons/arrow-right.svg"
            className="swiper-button-prev"
            alt="Previous"
          />
          <div className="dot-frame-pagination swiper-pagination"></div>
          <img
            src="/icons/arrow-right.svg"
            className="swiper-button-next"
            style={{ transform: "rotate(-180deg)" }}
            alt="Next"
          />
        </Box>
      </Stack>
    </div>
  );
}
