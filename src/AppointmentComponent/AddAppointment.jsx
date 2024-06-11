import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddAppointment = () => {
  let navigate = useNavigate();

  const patient = JSON.parse(sessionStorage.getItem("active-patient"));

  const [appointment, setAppointment] = useState({
    patientId: "",
    problem: "",
  });

  appointment.patientId = patient.id;

  const handleUserInput = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const saveAppointment = (event) => {
    event.preventDefault();
    // Kiểm tra nếu không điền đủ các trường
    if (!appointment.problem || !appointment.appointmentDate) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Dừng việc gửi yêu cầu nếu có lỗi
    }
    const currentDate = new Date();
    const selectedDate = new Date(appointment.appointmentDate);

    // Kiểm tra xem ngày hẹn có phải là ngày trong tương lai hay không
    if (selectedDate <= currentDate) {
      toast.error("Please select a future date for the appointment.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Dừng việc gửi yêu cầu nếu có lỗi
    }

    fetch("http://localhost:8080/api/appointment/patient/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    }).then((result) => {
      toast.success("Appointment Added Successfully!!!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/patient/appointments/");

      result
        .json()
        .then((res) => {
          console.log("response", res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center ms-2 me-2 mb-2">
        <div
          className="card form-card border-color text-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header bg-color custom-bg-text text-center">
            <h5 className="card-title">Take Appointment</h5>
          </div>
          <div className="card-body">
            <form onSubmit={saveAppointment}>
              <div className="mb-3 text-color">
                <label htmlFor="title" className="form-label">
                  <b>Problem</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="problem"
                  name="problem"
                  onChange={handleUserInput}
                  value={appointment.problem}
                  placeholder="mention your problems here..."
                />
              </div>
              <div className="mb-3 text-color">
                <label htmlFor="description" className="form-label">
                  <b>Appointment Date</b>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="appointmentDate"
                  name="appointmentDate"
                  onChange={handleUserInput}
                  value={appointment.appointmentDate}
                />
              </div>

              <input
                type="submit"
                className="btn btn-outline-primary"
                value="Take Appointment"
              />

              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
