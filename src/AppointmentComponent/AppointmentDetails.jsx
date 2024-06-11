import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentDetails = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const patient = JSON.parse(sessionStorage.getItem("active-patient"));

  useEffect(() => {
    const getAllAppointments = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/appointment/patient/id?patientId=${patient.id}`
      );
      console.log(response.data);

      // Sắp xếp các cuộc hẹn theo ngày từ mới nhất đến cũ nhất
      const sortedAppointments = response.data.sort((a, b) => {
        return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      });

      setAllAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments); // Initial setting of filtered appointments
    };

    getAllAppointments();
  }, [patient.id]);

  useEffect(() => {
    if (selectedAppointment && selectedAppointment.doctorId) {
      fetchDoctorDetails(selectedAppointment.doctorId);
    } else {
      setDoctor(null);
    }
  }, [selectedAppointment]);

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/id?id=${doctorId}`
      );
      setDoctor(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching doctor details", error);
      setDoctor(null);
    }
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
    filterAppointmentsByDate(e.target.value);
  };

  const filterAppointmentsByDate = (date) => {
    if (date) {
      const filtered = allAppointments.filter((appointment) => {
        return appointment.appointmentDate === date;
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(allAppointments);
    }
  };

  const cancelAppointment = (appointmentId) => {
    fetch("http://localhost:8080/api/appointment/patient/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: appointmentId,
        status: "Cancel",
      }),
    }).then((result) => {
      result.json().then((res) => {
        toast.success(res.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    });

    window.location.reload(true);
  };

  return (
    <div className="mt-3">
      <div className="d-flex">
        <div className="sidebar bg-light p-2" style={{ width: "25%" }}>
          <div className="fw-bolder fs-5 mb-3">Appointment</div>
          <div className="mb-3">
            <label className="form-label">Filter Date</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={handleDateChange}
            />
          </div>
          <ul className="list-group">
            {filteredAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className={`list-group-item ${
                  selectedAppointment &&
                  selectedAppointment.id === appointment.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div>
                  <strong>{appointment.patientName}</strong>
                </div>
                <div>
                  {appointment.startTime} - {appointment.endTime}
                </div>
                <div>{appointment.appointmentDate}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Details Panel */}
        {selectedAppointment && (
          <div className="details-panel bg-white p-3" style={{ width: "75%" }}>
            <div className="card">
              <div className="card-body">
                {doctor ? (
                  <div className="d-flex align-items-center">
                    {doctor.doctorImage ? (
                      <img
                        src={`http://localhost:8080/api/doctor/${doctor.doctorImage}`}
                        alt="Doctor"
                        className="img-thumbnail"
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <div
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: "#e0e0e0",
                        }}
                      ></div>
                    )}
                    <div className="ms-3">
                      <h4>
                        {doctor.firstName} {doctor.lastName}
                      </h4>
                      <p>
                        {doctor.specialist.name} - {doctor.experience} years of
                        experience
                      </p>
                      <p>
                        <strong>Contact:</strong> {doctor.contact}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5>Doctor Information</h5>
                    <p>Not Assigned to Doctor</p>
                  </div>
                )}
                <hr />
                <h5>Appointment Information</h5>
                <p>
                  <strong>Appointment ID:</strong> {selectedAppointment.id}
                </p>
                <p>
                  <strong>Date:</strong> {selectedAppointment.appointmentDate}
                </p>
                <p>
                  <strong>Time Schedule:</strong>{" "}
                  {selectedAppointment.startTime} -{" "}
                  {selectedAppointment.endTime}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                <hr />
                <h5>Patient Information</h5>
                <p>
                  <strong>Name:</strong> {selectedAppointment.patientName}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedAppointment.patientContact}
                </p>
                <p>
                  <strong>Problem:</strong> {selectedAppointment.problem}
                </p>
                <p>
                  <strong>Prescription:</strong>{" "}
                  {selectedAppointment.prescription}
                </p>
                <p>
                  <strong>Result:</strong> {selectedAppointment.result}
                </p>
                {selectedAppointment.status === "Not Assigned to Doctor" && (
                  <button
                    onClick={() => cancelAppointment(selectedAppointment.id)}
                    className="btn btn-danger"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AppointmentDetails;
