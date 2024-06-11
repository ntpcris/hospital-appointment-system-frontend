import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ViewAllPatient = () => {
  const [allPatient, setAllPatient] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const patientsPerPage = 10;

  useEffect(() => {
    const getAllPatient = async () => {
      const allPatient = await retrieveAllPatient();
      if (allPatient) {
        setAllPatient(allPatient);
      }
    };

    getAllPatient();
  }, []);

  const retrieveAllPatient = async () => {
    const response = await axios.get("http://localhost:8080/api/patient/all");
    console.log(response.data);
    return response.data;
  };

  const handleDeleteClick = (patientId) => {
    setPatientToDelete(patientId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const patientId = patientToDelete;
    fetch("http://localhost:8080/api/user/delete/id?userId=" + patientId, {
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
        setAllPatient(allPatient.filter((patient) => patient.id !== patientId));
        setShowModal(false);
      });
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = allPatient.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);
  const currentPatients = filteredPatients.slice(
    currentPage * patientsPerPage,
    (currentPage + 1) * patientsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 custom-bg border-color">
        <div className="card-header custom-bg-text text-center bg-color d-flex justify-content-between align-items-center">
          <h2>All Patients</h2>
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
                  <th scope="col">Full Name</th>
                  <th scope="col">Email Id</th>
                  <th scope="col">Age</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Blood Group</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Address</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <b>{`${patient.firstName} ${patient.lastName}`}</b>
                    </td>
                    <td>
                      <b>{patient.emailId}</b>
                    </td>
                    <td>
                      <b>{patient.age}</b>
                    </td>
                    <td>
                      <b>{patient.sex}</b>
                    </td>
                    <td>
                      <b>{patient.bloodGroup}</b>
                    </td>
                    <td>
                      <b>{patient.contact}</b>
                    </td>
                    <td>
                      <b>{`${patient.street} ${patient.city}`}</b>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleDeleteClick(patient.id)}
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
            Showing {currentPage * patientsPerPage + 1} to{" "}
            {Math.min(
              (currentPage + 1) * patientsPerPage,
              filteredPatients.length
            )}{" "}
            of {filteredPatients.length} entries
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
        <Modal.Body>Are you sure you want to delete this patient?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllPatient;
