import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AssignAppointment = () => {
  let navigate = useNavigate();
  const { appointmentId } = useParams();

  const [specialist, setSpecialist] = useState("");
  const [appointment, setAppointment] = useState({});
  const [slot, setSlot] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [showCancelButton, setShowCancelButton] = useState(false);

  const retrieveAppointment = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/appointment/id?appointmentId=${appointmentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }
  }, [appointmentId]);

  const retrieveSpecialists = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/specialist/getAllSpecialist"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching specialists:", error);
      return [];
    }
  }, []);

  const retrieveAvailableSlot = useCallback(async (specialist, date) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/slotBooking/getSlotBySpecialist?specialist=${specialist}&date=${date}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(
          "No available slot found for the selected specialist and date!!!",
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
        setShowCancelButton(true);
      } else {
        console.error("Error fetching slot:", error);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const patientAppointment = await retrieveAppointment();
      const specialistList = await retrieveSpecialists();
      if (patientAppointment) {
        setAppointment(patientAppointment);
      }
      if (specialistList) {
        setSpecialists(specialistList);
      }
    };

    fetchData();
  }, [retrieveAppointment, retrieveSpecialists]);

  useEffect(() => {
    if (specialist && appointment.appointmentDate) {
      const fetchSlot = async () => {
        const availableSlot = await retrieveAvailableSlot(
          specialist,
          appointment.appointmentDate
        );
        if (availableSlot) {
          setSlot(availableSlot);
          setShowCancelButton(false);
        } else {
          setSlot(null);
        }
      };

      fetchSlot();
    }
  }, [specialist, appointment.appointmentDate, retrieveAvailableSlot]);

  const saveAppointment = async (e) => {
    e.preventDefault();
    if (!slot) {
      toast.error("No available slot found!!!", {
        position: "top-center",
        autoClose: 1000,
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
    formData.append("slotId", slot.id);
    formData.append("specialist", specialist);

    try {
      await axios.post(
        "http://localhost:8080/api/appointment/admin/assign/doctor",
        formData
      );
      toast.success("Patient Appointment Assigned to Doctor!!!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/admin/appointments/all");
        window.location.reload(true);
      }, 2000);
    } catch (error) {
      console.error("Error assigning appointment:", error);
      toast.error("Error assigning appointment", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const cancelAppointment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/appointment/cancelByAdmin/${appointmentId}`
      );
      if (response.status === 200) {
        // Xử lý khi hủy cuộc hẹn thành công
        toast.success("Appointment cancelled successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/admin/appointments/all");
          window.location.reload(true);
        }, 1000);
      } else {
        // Xử lý khi hủy cuộc hẹn thất bại
        toast.error(
          `Failed to cancel appointment: ${response.data.responseMessage}`,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Error cancelling appointment", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div
          className="card form-card border-color custom-bg"
          style={{ width: "25rem" }}
        >
          <div className="card-header bg-color custom-bg-text text-center">
            <h5 className="card-title">Assign Doctor to Appointment</h5>
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
                <label htmlFor="specialist" className="form-label">
                  <b>Specialist</b>
                </label>
                <select
                  id="specialist"
                  name="specialist"
                  className="form-control"
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                >
                  <option value="">Select Specialist</option>
                  {specialists.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {slot && (
                <>
                  <div className="mb-3">
                    <label className="form-label">
                      <b>Doctor</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${slot.doctor.firstName} ${slot.doctor.lastName}`}
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <b>Available Slot</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${slot.timeSchedule.startTime} - ${slot.timeSchedule.endTime}`}
                      readOnly
                    />
                  </div>
                </>
              )}

              <div className="d-flex justify-content-between">
                <button
                  type="submit"
                  className="btn btn-outline-primary"
                  onClick={saveAppointment}
                >
                  Assign Doctor
                </button>

                {showCancelButton && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={cancelAppointment}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAppointment;
