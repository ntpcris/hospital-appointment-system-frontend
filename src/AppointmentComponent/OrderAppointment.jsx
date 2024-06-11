import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAppointment = () => {
  let navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    problem: "",
    appointmentDate: "",
  });

  const [patientInfo, setPatientInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    contact: "",
    age: "",
    sex: "",
    emailId: "",
    street: "",
    city: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAndSetPatient = async () => {
      const rolePatient = JSON.parse(sessionStorage.getItem("active-patient"));
      const patientData = await fetchPatientData(rolePatient.id);
      if (patientData) {
        setPatientInfo(patientData);
      }
    };

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

    fetchAndSetPatient();
  }, []);

  const handleUserInput = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handlePatientEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const savePatientInfo = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/patient/updatePatient`,
        {
          id: patientInfo.id,
          firstName: patientInfo.firstName,
          lastName: patientInfo.lastName,
          contact: patientInfo.contact,
          age: patientInfo.age,
          sex: patientInfo.sex,
          emailId: patientInfo.emailId,
          street: patientInfo.street,
          city: patientInfo.city,
          role: patientInfo.role,
        }
      );

      if (response.status === 200) {
        setPatientInfo(response.data);

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
      toast.error(
        "Failed to update patient information. Please try again later.",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  const saveAppointment = (event) => {
    event.preventDefault();
    if (!appointment.problem || !appointment.appointmentDate) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const selectedDate = new Date(appointment.appointmentDate);
    selectedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

    if (selectedDate < currentDate) {
      toast.error(
        "The booking date is past the hospital's current operating date",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return;
    }

    fetch("http://localhost:8080/api/appointment/patient/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...appointment, patientId: patientInfo.id }),
    })
      .then((result) => {
        if (result.status === 200) {
          // Xử lý khi đăng ký thành công
          toast.success("Appointment Added Successfully!!!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigator("/patient/appointmentDetails");
        } else if (result.status === 400) {
          result.json().then((res) => {
            // Xử lý khi email đã tồn tại
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        } else {
          // Xử lý khi có lỗi server
          toast.error("Failed to order appointment", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        // Xử lý khi email đã tồn tại
        toast.error(error.response.data.responseMessage, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title">Date</h5>
            </div>
            <div className="card-body">
              <input
                type="date"
                className="form-control"
                name="appointmentDate"
                onChange={handleUserInput}
                value={appointment.appointmentDate}
              />
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title">Information Patient</h5>
              <button
                className="btn btn-outline-primary"
                onClick={handlePatientEditToggle}
              >
                {isEditing ? "Cancel" : "View"}
              </button>
            </div>
            <div className="card-body">
              {isEditing ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      onChange={handlePatientChange}
                      value={patientInfo.firstName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      onChange={handlePatientChange}
                      value={patientInfo.lastName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      onChange={handlePatientChange}
                      value={patientInfo.contact}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="text"
                      className="form-control"
                      name="age"
                      onChange={handlePatientChange}
                      value={patientInfo.age}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sex</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sex"
                      onChange={handlePatientChange}
                      value={patientInfo.sex}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emailId"
                      value={patientInfo.emailId}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      onChange={handlePatientChange}
                      value={patientInfo.street}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      onChange={handlePatientChange}
                      value={patientInfo.city}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={savePatientInfo}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <b>Full Name:</b> {patientInfo.firstName}{" "}
                    {patientInfo.lastName}
                  </p>
                  <p>
                    <b>Age:</b> {patientInfo.age}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Problem</h5>
            </div>
            <div className="card-body">
              <textarea
                className="form-control"
                name="problem"
                onChange={handleUserInput}
                value={appointment.problem}
                placeholder="mention your problems here..."
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Information Appointment</h5>
            </div>
            <div className="card-body">
              <p>
                <b>Full Name:</b> {patientInfo.firstName} {patientInfo.lastName}
              </p>
              <p>
                <b>Address:</b> {patientInfo.street} {patientInfo.city}
              </p>
              <p>
                <b>Date Appointment:</b> {appointment.appointmentDate}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary mt-3 w-100"
            onClick={saveAppointment}
          >
            Order
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAppointment;
