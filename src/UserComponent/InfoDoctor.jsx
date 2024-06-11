import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InfoDoctor = () => {
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editDoctor, setEditDoctor] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    age: "",
    sex: "",
    experience: "",
    emailId: "",
    street: "",
    city: "",
    role: "",
    specialist: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  editDoctor.role = "doctor";

  useEffect(() => {
    const fetchAndSetDoctor = async () => {
      const roleDoctor = JSON.parse(sessionStorage.getItem("active-doctor"));
      const doctorData = await fetchDoctorData(roleDoctor.id);
      if (doctorData) {
        setDoctor(doctorData);
        setEditDoctor({
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          contact: doctorData.contact,
          age: doctorData.age,
          sex: doctorData.sex,
          experience: doctorData.experience,
          emailId: doctorData.emailId,
          street: doctorData.street,
          city: doctorData.city,
          specialist: doctorData.specialist.name,
        });
      }
    };
    fetchAndSetDoctor();
  }, []);

  const fetchDoctorData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/doctor/id?id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the doctor data!", error);
      return null;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor({ ...editDoctor, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      console.log(editDoctor);
      const response = await axios.post(
        `http://localhost:8080/api/doctor/updateDoctor`,
        {
          id: doctor.id,
          firstName: editDoctor.firstName,
          lastName: editDoctor.lastName,
          contact: editDoctor.contact,
          age: editDoctor.age,
          sex: editDoctor.sex,
          experience: editDoctor.experience,
          street: editDoctor.street,
          city: editDoctor.city,
        }
      );

      if (response.status === 200) {
        setDoctor(response.data);

        toast.success("Update Info Successful!!!", {
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
        toast.error("Update failed, Please try again", {
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
      console.error("Error updating doctor information:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/doctor/changePassword", {
        emailId: doctor.emailId,
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

  if (!doctor) {
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
                      value={editDoctor.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={editDoctor.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      value={editDoctor.contact}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      className="form-control"
                      name="age"
                      value={editDoctor.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sex</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sex"
                      value={editDoctor.sex}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience</label>
                    <input
                      type="text"
                      className="form-control"
                      name="experience"
                      value={editDoctor.experience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emailId"
                      value={editDoctor.emailId}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={editDoctor.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={editDoctor.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialty</label>
                    <input
                      type="text"
                      className="form-control"
                      name="specialty"
                      value={editDoctor.specialist}
                      disabled
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
                    <strong>Full Name:</strong> {doctor.firstName}{" "}
                    {doctor.lastName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {doctor.contact}
                  </p>
                  <p>
                    <strong>Age:</strong> {doctor.age}
                  </p>
                  <p>
                    <strong>Sex:</strong> {doctor.sex}
                  </p>
                  <p>
                    <strong>Experience:</strong> {doctor.experience} Years
                  </p>
                  <p>
                    <strong>Email:</strong> {doctor.emailId}
                  </p>
                  <p>
                    <strong>Address:</strong> {doctor.street} {doctor.city}
                  </p>
                  <p>
                    <strong>Specialist:</strong> {doctor.specialist.name}
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

export default InfoDoctor;
