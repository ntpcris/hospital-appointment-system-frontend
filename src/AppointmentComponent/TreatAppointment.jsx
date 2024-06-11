import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TreatAppointment = () => {
  let navigate = useNavigate();

  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState("");

  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");

  const [prescription, setPrescription] = useState("");

  const retrieveAppointment = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/appointment/id?appointmentId=" + appointmentId
    );
    return response.data;
  };

  useEffect(() => {
    const getAppointment = async () => {
      const patientAppointment = await retrieveAppointment();
      if (patientAppointment) {
        setAppointment(patientAppointment);
      }
    };

    getAppointment();
  }, []);

  const saveAppointment = (e) => {
    e.preventDefault();

    if (!result || !prescription || !status) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const formData = new FormData();
    formData.append("appointmentId", appointmentId);
    formData.append("result", result);
    formData.append("prescription", prescription);
    formData.append("status", status);

    axios
      .post("http://localhost:8080/api/appointment/doctor/update", formData)
      .then((result) => {
        console.log(result);

        toast.success("Patient Appointment Status updated Successfully!!!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error updating appointment status:", error);
        toast.error(
          "An error occurred while updating appointment status. Please try again.",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header bg-color custom-bg-text text-center">
            <h5 className="card-title">Update Appointment</h5>
          </div>
          <div className="card-body text-color">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Patient Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={appointment.patientName}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  <b>Problem Description</b>
                </label>
                <textarea
                  className="form-control"
                  id="problem"
                  name="problem"
                  rows="3"
                  value={appointment.problem}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <b>Appointment Date</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={appointment.appointmentDate}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="result" className="form-label">
                  <b>Result</b>
                </label>
                <textarea
                  className="form-control"
                  id="result"
                  name="result"
                  rows="3"
                  onChange={(e) => {
                    setResult(e.target.value);
                  }}
                  value={result}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="prescription" className="form-label">
                  <b>Prescription</b>
                </label>
                <textarea
                  className="form-control"
                  id="prescription"
                  name="prescription"
                  rows="3"
                  onChange={(e) => {
                    setPrescription(e.target.value);
                  }}
                  value={prescription}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <b>Appointment Status</b>
                </label>
                <select
                  name="status"
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className="form-control"
                >
                  <option value="">Select Appointment Status</option>
                  <option value="Treatment Done">Treatment Done</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary"
                onClick={saveAppointment}
              >
                Update Appointment Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatAppointment;
