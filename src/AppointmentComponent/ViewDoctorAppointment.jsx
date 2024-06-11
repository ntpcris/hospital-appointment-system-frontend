import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewDoctorAppointment = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const doctor = JSON.parse(sessionStorage.getItem("active-doctor"));

  useEffect(() => {
    const getAllAppointments = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/appointment/doctor/id?doctorId=${doctor.id}`
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
  }, [doctor.id]);

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

  return (
    <div className="mt-3">
      <div className="d-flex">
        <div className="sidebar bg-light p-2" style={{ width: "25%" }}>
          <div className="fw-bolder fs-5 mb-3">Appointments</div>
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
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    (window.location.href = `/doctor/appointment/${selectedAppointment.id}/update`)
                  }
                >
                  Update Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewDoctorAppointment;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import React from "react";
// import { Link } from "react-router-dom";

// const ViewDoctorAppointment = () => {
//   const [allAppointments, setAllAppointments] = useState([]);

//   const doctor = JSON.parse(sessionStorage.getItem("active-doctor"));

//   useEffect(() => {
//     const getAllAppointments = async () => {
//       const allAppointments = await retrieveAllAppointments();
//       if (allAppointments) {
//         setAllAppointments(allAppointments);
//       }
//     };

//     getAllAppointments();
//   }, []);

//   const retrieveAllAppointments = async () => {
//     const response = await axios.get(
//       "http://localhost:8080/api/appointment/doctor/id?doctorId=" + doctor.id
//     );
//     console.log(response.data);
//     return response.data;
//   };

//   return (
//     <div className="mt-3">
//       <div
//         className="card form-card ms-2 me-2 mb-5 custom-bg border-color "
//         style={{
//           height: "45rem",
//         }}
//       >
//         <div className="card-header custom-bg-text text-center bg-color">
//           <h2>All Appointments</h2>
//         </div>
//         <div
//           className="card-body"
//           style={{
//             overflowY: "auto",
//           }}
//         >
//           <div className="table-responsive">
//             <table className="table table-hover text-color text-center">
//               <thead className="table-bordered border-color bg-color custom-bg-text">
//                 <tr>
//                   <th scope="col">Patient Name</th>
//                   <th scope="col">Doctor Name</th>
//                   <th scope="col">Problem</th>
//                   <th scope="col">Result</th>
//                   <th scope="col">Precription</th>
//                   <th scope="col">Appointment Take Date</th>
//                   <th scope="col">Appointment Date</th>
//                   <th scope="col">Appointment Status</th>
//                   <th scope="col">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {allAppointments.map((a) => {
//                   return (
//                     <tr>
//                       <td>
//                         <b>{a.patientName}</b>
//                       </td>
//                       <td>
//                         <b>{a.doctorName}</b>
//                       </td>
//                       <td>
//                         <b>{a.problem}</b>
//                       </td>
//                       <td>
//                         <b>{a.result}</b>
//                       </td>
//                       <td>
//                         <b>{a.prescription}</b>
//                       </td>
//                       <td>
//                         <b>{a.date}</b>
//                       </td>
//                       <td>
//                         <b>{a.appointmentDate}</b>
//                       </td>
//                       <td>
//                         <b>{a.status}</b>
//                       </td>
//                       <td>
//                         <Link
//                           to={`/doctor/appointment/${a.id}/update`}
//                           className="nav-link active btn btn-sm"
//                           aria-current="page"
//                         >
//                           <b className="text-color">Update Appointment</b>
//                         </Link>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewDoctorAppointment;
