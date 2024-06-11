import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
// import "./Pagination.css"; // Import your custom CSS

const ViewAllAppointment = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orderDateFilter, setOrderDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const appointmentsPerPage = 10;

  useEffect(() => {
    const getAllAppointments = async () => {
      const allAppointments = await retrieveAllAppointments();
      if (allAppointments) {
        // Sort appointments by date in descending order
        allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllAppointments(allAppointments);
        setFilteredAppointments(allAppointments); // Initialize filtered appointments
      }
    };

    getAllAppointments();
  }, []);

  const retrieveAllAppointments = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/appointment/all"
    );
    console.log(response.data);
    return response.data;
  };

  const handleFilter = useCallback(() => {
    const filtered = allAppointments.filter((appointment) => {
      const matchesSearchTerm = appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Assign To Doctor" &&
          appointment.doctorId === 0 &&
          appointment.status !== "Cancel") ||
        (statusFilter === "Assigned to Doctor" &&
          appointment.doctorId !== 0 &&
          appointment.status !== "Cancel") ||
        (statusFilter === "Cancelled" && appointment.status === "Cancel");
      const matchesDate =
        !orderDateFilter ||
        new Date(appointment.date).toDateString() ===
          new Date(orderDateFilter).toDateString();

      return matchesSearchTerm && matchesStatus && matchesDate;
    });

    console.log("Filtered Appointments:", filtered); // Debugging statement

    setFilteredAppointments(filtered);
    setCurrentPage(0); // Reset to first page
  }, [allAppointments, searchTerm, statusFilter, orderDateFilter]);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, statusFilter, orderDateFilter, handleFilter]);

  // Calculate appointments for the current page
  const pageCount = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const currentAppointments = filteredAppointments.slice(
    currentPage * appointmentsPerPage,
    (currentPage + 1) * appointmentsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
        <div className="card-header custom-bg-text text-center bg-color d-flex justify-content-between align-items-center">
          <div className="fw-bolder fs-3 mb-3">Appointments</div>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by Patient Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="d-flex mb-3 align-items-end">
            <div className="me-2">
              <label htmlFor="statusFilter" className="form-label">
                Status
              </label>
              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Assign To Doctor">Assign To Doctor</option>
                <option value="Assigned to Doctor">Assigned to Doctor</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="me-2">
              <label htmlFor="orderDateFilter" className="form-label">
                Order Date
              </label>
              <input
                id="orderDateFilter"
                type="date"
                className="form-control"
                value={orderDateFilter}
                onChange={(e) => setOrderDateFilter(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleFilter}>
              Filter
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Patient Name</th>
                  <th scope="col">Doctor Name</th>
                  <th scope="col">Order Date</th>
                  <th scope="col">Appointment Date</th>
                  <th scope="col">Specialist</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <b>{a.patientName}</b>
                    </td>
                    <td>
                      <b> {a.doctorId !== 0 ? `${a.doctorName}` : ""}</b>
                    </td>
                    <td>
                      <b>{a.date}</b>
                    </td>
                    <td>
                      <b>
                        {a.doctorId !== 0
                          ? `${a.startTime} - ${a.endTime} ${a.appointmentDate}`
                          : `${a.appointmentDate}`}
                      </b>
                    </td>
                    <td>
                      <b> {a.doctorId !== 0 ? `${a.specialist}` : ""}</b>
                    </td>
                    <td>
                      {a.status !== "Cancel" ? (
                        a.doctorId === 0 ? (
                          <Link
                            to={`/admin/appointment/${a.id}/assign`}
                            className="nav-link active btn btn-sm text-primary"
                            aria-current="page"
                          >
                            <b>Assign To Doctor</b>
                          </Link>
                        ) : (
                          <b>Assigned to Doctor</b>
                        )
                      ) : (
                        <b>Cancelled</b>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <ReactPaginate
            previousLabel={"«"}
            nextLabel={"»"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            previousClassName={"previous"}
            nextClassName={"next"}
            disabledClassName={"disabled"}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewAllAppointment;
