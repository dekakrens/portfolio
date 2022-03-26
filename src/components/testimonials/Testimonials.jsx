import React from "react";
import "./testimonials.css";
import AVTR1 from "../../assets/avatar1.jpg";
import AVTR2 from "../../assets/avatar2.jpg";
import AVTR3 from "../../assets/avatar3.jpg";
import AVTR4 from "../../assets/avatar4.jpg";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const data = [
  {
    id: 1,
    avatar: AVTR1,
    name: "Tina Snow",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus hic blanditiis autem modi ducimus explicabo doloremque excepturi eum? Quas quia repellendus soluta esse! Placeat perspiciatis quas ad culpa earum.",
  },
  {
    id: 2,
    avatar: AVTR2,
    name: "Satta Wale",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus hic blanditiis autem modi ducimus explicabo doloremque excepturi eum? Quas quia repellendus soluta esse! Placeat perspiciatis quas ad culpa earum.",
  },
  {
    id: 3,
    avatar: AVTR3,
    name: "Kwame Despite",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus hic blanditiis autem modi ducimus explicabo doloremque excepturi eum? Quas quia repellendus soluta esse! Placeat perspiciatis quas ad culpa earum.",
  },
  {
    id: 4,
    avatar: AVTR4,
    name: "Nana Ama McBrown",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus hic blanditiis autem modi ducimus explicabo doloremque excepturi eum? Quas quia repellendus soluta esse! Placeat perspiciatis quas ad culpa earum.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials">
      <h5>Review from Client</h5>
      <h2>Testimonials</h2>

      <Swiper
        className="container testimonials__container"
        modules={[Pagination, Navigation]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {data.map((item) => (
          <SwiperSlide className="testimonial" key={item.id}>
            <div className="client__avatar">
              <img src={item.avatar} alt={`avatar ${item.id}`} />
            </div>
            <h5 className="client__name">{item.name}</h5>
            <small className="client__review">{item.review}</small>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
