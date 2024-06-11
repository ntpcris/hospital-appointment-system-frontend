import Carousel from "./Carousel";
import axios from "axios";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import DoctorCard from "../UserComponent/DoctorCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [allDoctor, setAllDoctor] = useState([]);

  const retrieveAllDoctor = async () => {
    const response = await axios.get("http://localhost:8080/api/doctor/all");
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    const getAllDoctor = async () => {
      const allDoctor = await retrieveAllDoctor();
      if (allDoctor) {
        setAllDoctor(allDoctor);
      }
    };

    getAllDoctor();
  }, []);

  const settings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <button className="slick-prev">Previous</button>,
    nextArrow: <button className="slick-next">Next</button>,
  };

  return (
    <div className="container-fluid mb-2">
      <Carousel />
      <div className="mt-2 mb-5">
        <div className="row">
          <div className="col-md-12">
            <h2
              id="appointment-heading"
              className="mt-5 mb-2 d-flex justify-content-center font-weight-bold"
            >
              SCHEDULE AN APPOINTMENT ONLINE
            </h2>
            <h5 className="mt-1 mb-5 d-flex justify-content-center text-muted ">
              Make an appointment easily quickly
            </h5>
            <div>
              <h3 className="mb-3">List Doctor</h3>
              <div className="row row-cols-1 gx-3">
                <Slider {...settings}>
                  {allDoctor.map((doctor) => (
                    <div className="col" key={doctor.id}>
                      <DoctorCard item={doctor} />
                    </div>
                  ))}
                </Slider>
              </div>
              {/* <div className="row row-cols-1 row-cols-md-5 g-3">
                {allDoctor.map((doctor) => {
                  return <DoctorCard key={doctor.id} item={doctor} />;
                })}
               
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default HomePage;
