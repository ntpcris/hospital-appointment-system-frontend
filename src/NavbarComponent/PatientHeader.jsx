import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientHeader = () => {
  let navigate = useNavigate();

  const userLogout = () => {
    toast.success("Logged out!!!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-patient");

    navigate("/home");
    window.location.reload(true);
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      {/* <li className="nav-item">
        <Link
          to="patient/appointment/take"
          className="nav-link active"
          aria-current="page"
        >
          <b className="button-like">Take Appointment</b>
        </Link>
      </li> */}

      <li className="nav-item">
        <Link
          to="patient/appointment/order"
          className="nav-link active"
          aria-current="page"
        >
          <b className="button-like">Order Appointment</b>
        </Link>
      </li>

      {/* <li className="nav-item">
        <Link
          to="patient/appointments"
          className="nav-link active"
          aria-current="page"
        >
          <b className="button-like">My Appointments</b>
        </Link>
      </li> */}
      <li className="nav-item">
        <Link
          to="patient/appointmentDetails"
          className="nav-link active"
          aria-current="page"
        >
          <b className="button-like">Appointments Details</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="patient/info" className="nav-link active" aria-current="page">
          <b className="button-like">Information</b>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={userLogout}
        >
          <b className="btn btn-outline-primary text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default PatientHeader;
