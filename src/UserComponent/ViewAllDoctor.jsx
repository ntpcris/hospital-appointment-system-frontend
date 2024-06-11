import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
// import "./Pagination.css"; // Import your custom CSS

const ViewAllDoctor = () => {
  const [allDoctor, setAllDoctor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const doctorsPerPage = 5;

  useEffect(() => {
    const getAllDoctor = async () => {
      const allDoctor = await retrieveAllDoctor();
      if (allDoctor) {
        setAllDoctor(allDoctor);
      }
    };

    getAllDoctor();
  }, []);

  const retrieveAllDoctor = async () => {
    const response = await axios.get("http://localhost:8080/api/doctor/all");
    console.log(response.data);
    return response.data;
  };

  const deleteDoctor = (doctorId) => {
    fetch("http://localhost:8080/api/user/delete/id?userId=" + doctorId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((res) => {
        toast.success(res.responseMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setAllDoctor(allDoctor.filter((doctor) => doctor.id !== doctorId));
        setShowModal(false);
      });
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = allDoctor.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const currentDoctors = filteredDoctors.slice(
    currentPage * doctorsPerPage,
    (currentPage + 1) * doctorsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteClick = (doctorId) => {
    setDoctorToDelete(doctorId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    deleteDoctor(doctorToDelete);
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
        <div className="card-header custom-bg-text text-center bg-color d-flex justify-content-between align-items-center">
          <h2>All Doctors</h2>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="form-control w-25"
          />
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Doctor</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email Id</th>
                  <th scope="col">Specialist</th>
                  <th scope="col">Experience</th>
                  <th scope="col">Age</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Address</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <img
                        src={
                          "http://localhost:8080/api/doctor/" +
                          doctor.doctorImage
                        }
                        className="img-fluid"
                        alt="doctor_pic"
                        style={{
                          maxWidth: "90px",
                        }}
                      />
                    </td>
                    <td>
                      <b>{`${doctor.firstName} ${doctor.lastName}`}</b>
                    </td>
                    <td>
                      <b>{doctor.emailId}</b>
                    </td>
                    <td>
                      <b>{doctor.specialist ? doctor.specialist.name : ""}</b>
                    </td>
                    <td>
                      <b>{doctor.experience}</b>
                    </td>
                    <td>
                      <b>{doctor.age}</b>
                    </td>
                    <td>
                      <b>{doctor.contact}</b>
                    </td>
                    <td>
                      <b>{`${doctor.street} ${doctor.city}`}</b>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleDeleteClick(doctor.id)}
                      >
                        <i className="fa-solid fa-user-lock"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            Showing {currentPage * doctorsPerPage + 1} to{" "}
            {Math.min(
              (currentPage + 1) * doctorsPerPage,
              filteredDoctors.length
            )}{" "}
            of {filteredDoctors.length} entries
          </div>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this doctor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllDoctor;
