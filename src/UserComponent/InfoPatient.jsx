import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InfoPatient = () => {
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editPatient, setEditPatient] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    age: "",
    sex: "",
    emailId: "",
    street: "",
    city: "",
    role: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  editPatient.role = "patient";

  useEffect(() => {
    const fetchAndSetPatient = async () => {
      const rolePatient = JSON.parse(sessionStorage.getItem("active-patient"));
      const patientData = await fetchPatientData(rolePatient.id);
      if (patientData) {
        setPatient(patientData);
        setEditPatient({
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          contact: patientData.contact,
          age: patientData.age,
          sex: patientData.sex,
          emailId: patientData.emailId,
          street: patientData.street,
          city: patientData.city,
        });
      }
    };
    fetchAndSetPatient();
  }, []);

  const fetchPatientData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patient/id?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the patient data!", error);
      return null;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPatient({ ...editPatient, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      console.log(editPatient);
      const response = await axios.post(
        `http://localhost:8080/api/patient/updatePatient`,
        {
          id: patient.id, // id của bệnh nhân
          firstName: editPatient.firstName,
          lastName: editPatient.lastName,
          contact: editPatient.contact,
          age: editPatient.age,
          sex: editPatient.sex,
          emailId: editPatient.emailId,
          street: editPatient.street,
          city: editPatient.city,
          role: editPatient.role,
        }
      );

      if (response.status === 200) {
        setPatient(response.data);

        toast.success("Update Infor Successful!!!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setIsEditing(false);
      } else {
        toast.error("Update fail, Please Again", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating patient information:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/patient/changePassword", {
        emailId: patient.emailId,
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Error changing password", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="container-fluid bg-light p-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="fw-bolder fs-3 mb-4">Account</div>
      <div className="row gx-5">
        <div className="col-lg-6 mb-4">
          <div className="card p-4 shadow-sm">
            <div className="card-body">
              <div className="fw-bolder fs-5 mb-3">Information</div>
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={editPatient.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={editPatient.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      value={editPatient.contact}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      className="form-control"
                      name="age"
                      value={editPatient.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sex</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sex"
                      value={editPatient.sex}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emailId"
                      value={editPatient.emailId}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={editPatient.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={editPatient.city}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    onClick={handleSaveClick}
                    className="btn btn-outline-primary mt-3"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Full Name:</strong> {patient.firstName}{" "}
                    {patient.lastName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {patient.contact}
                  </p>
                  <p>
                    <strong>Age:</strong> {patient.age}
                  </p>
                  <p>
                    <strong>Sex:</strong> {patient.sex}
                  </p>
                  <p>
                    <strong>Email:</strong> {patient.emailId}
                  </p>
                  <p>
                    <strong>Address:</strong> {patient.street} {patient.city}
                  </p>
                  <button
                    onClick={handleEditClick}
                    className="btn btn-outline-primary mt-3"
                  >
                    Change Information
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card p-4 shadow-sm">
            <div className="card-body">
              <div className="fw-bolder fs-5 mb-3">Change Password</div>
              <form onSubmit={handleChangePassword}>
                <div className="form-group mb-3">
                  <label>
                    Current password <span className="text-danger">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="mt-2 form-control"
                      placeholder="Your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text password-eye-icon"
                      onClick={handleTogglePasswordVisibility}
                    >
                      <i
                        className={
                          isPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                        }
                      />
                    </span>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    New Password <span className="text-danger">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="mt-2 form-control"
                      placeholder="Enter a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text password-eye-icon"
                      onClick={handleTogglePasswordVisibility}
                    >
                      <i
                        className={
                          isPasswordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                        }
                      />
                    </span>
                  </div>
                </div>
                <input
                  type="submit"
                  className="btn btn-outline-primary"
                  value="Change"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPatient;
