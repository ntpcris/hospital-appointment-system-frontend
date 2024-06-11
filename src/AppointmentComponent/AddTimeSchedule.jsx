import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddTimeSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [isMorningChecked, setIsMorningChecked] = useState(false);
  const [isAfternoonChecked, setIsAfternoonChecked] = useState(false);
  const [isEveningChecked, setIsEveningChecked] = useState(false);
  const [morningStart, setMorningStart] = useState("08:00");
  const [morningEnd, setMorningEnd] = useState("11:00");
  const [afternoonStart, setAfternoonStart] = useState("13:00");
  const [afternoonEnd, setAfternoonEnd] = useState("17:00");
  const [eveningStart, setEveningStart] = useState("18:00");
  const [eveningEnd, setEveningEnd] = useState("21:00");
  const [scheduleList, setScheduleList] = useState([]);
  const [timeScheduleList, setTimeScheduleList] = useState([]);

  const handleAddSchedule = async () => {
    const selectedSchedules = [];
    if (isMorningChecked) {
      selectedSchedules.push({
        date: date.toISOString().split("T")[0], // Extract date only from ISO string
        startTime: morningStart,
        endTime: morningEnd,
      });
    }
    if (isAfternoonChecked) {
      selectedSchedules.push({
        date: date.toISOString().split("T")[0],
        startTime: afternoonStart,
        endTime: afternoonEnd,
      });
    }
    if (isEveningChecked) {
      selectedSchedules.push({
        date: date.toISOString().split("T")[0],
        startTime: eveningStart,
        endTime: eveningEnd,
      });
    }
    setScheduleList([...scheduleList, ...selectedSchedules]); // Efficiently update scheduleList
    return selectedSchedules;
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const updateScheduleList = await handleAddSchedule();
    // Gửi scheduleList đến backend sử dụng Axios hoặc Fetch API (ví dụ)
    console.log(updateScheduleList);
    await fetch("http://localhost:8080/api/timeschedule/admin/addSchedule", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateScheduleList),
    }).then((result) => {
      if (result.status === 200) {
        toast.success("Add TimeSchedule Successfully!!!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to add ScheduleTime. Please try again later.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  const fetchScheduleData = async (selectedDate) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/timeschedule/admin/getScheduleByDate?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedData = await response.json();
      setTimeScheduleList(fetchedData);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    const formattedDate = date.toISOString().split("T")[0]; // Extract date only
    fetchScheduleData(formattedDate);
    // Fetch data on date change
  }, [date]);

  return (
    <div className="right-content">
      <div className="fw-bolder fs-5 mb-3">Management WorkSchedule</div>

      <form onSubmit={handleSubmit}>
        <span className="fw-bold">Configure working time:</span>
        <div className="card mt-2">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label for="selectDay" className="me-3">
                  Select Day
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="selectDay"
                  onChange={(e) => setDate(new Date(e.target.value))} // Update state on change
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-end">
                  <input
                    type="submit"
                    className={`btn ${
                      timeScheduleList.length > 0
                        ? "btn-danger"
                        : "btn-outline-primary"
                    }`} // Thay đổi "btn-outline-primary" thành "btn"
                    value={timeScheduleList.length > 0 ? "Activated" : "Active"} // Thay đổi giá trị value
                    disabled={timeScheduleList.length > 0} // Thay đổi điều kiện disabled
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="morningCheckbox"
                    checked={isMorningChecked}
                    onChange={() => setIsMorningChecked(!isMorningChecked)}
                  />
                  <label className="form-check-label" for="morningCheckbox">
                    Morning
                  </label>
                </div>

                {isMorningChecked && (
                  <div className="d-flex mt-2">
                    <input
                      type="text"
                      className="form-control input-time me-2"
                      value={morningStart}
                      onChange={(e) => setMorningStart(e.target.value)}
                    />
                    <span className="align-self-center"> to </span>
                    <input
                      type="text"
                      className="form-control input-time"
                      value={morningEnd}
                      onChange={(e) => setMorningEnd(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="afternoonCheckbox"
                    checked={isAfternoonChecked}
                    onChange={() => setIsAfternoonChecked(!isAfternoonChecked)}
                  />
                  <label className="form-check-label" for="afternoonCheckbox">
                    Afternoon
                  </label>
                </div>
                {isAfternoonChecked && (
                  <div className="d-flex mt-2 justify-content-between">
                    <input
                      type="text"
                      className="form-control  input-time me-2"
                      value={afternoonStart}
                      onChange={(e) => setAfternoonStart(e.target.value)}
                    />
                    <span className="align-self-center ">to</span>
                    <input
                      type="text"
                      className="form-control input-time"
                      value={afternoonEnd}
                      onChange={(e) => setAfternoonEnd(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="eveningCheckbox"
                    checked={isEveningChecked}
                    onChange={() => setIsEveningChecked(!isEveningChecked)}
                  />
                  <label className="form-check-label" for="eveningCheckbox">
                    Everning
                  </label>
                </div>
                {isEveningChecked && (
                  <div className="d-flex mt-2">
                    <input
                      type="text"
                      className="form-control input-time me-2"
                      value={eveningStart}
                      onChange={(e) => setEveningStart(e.target.value)}
                    />
                    <span className="align-self-center">to</span>
                    <input
                      type="text"
                      className="form-control input-time"
                      value={eveningEnd}
                      onChange={(e) => setEveningEnd(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTimeSchedule;

/* <div
        className="my-12 row-between"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span className="fw-bold">Cấu hình thời gian làm việc:</span>
        <div
          className="column-center "
          style={{ display: "flex", flexDirection: "row" }}
        >
          <label htmlFor="selectDay" className="mx-20">
            Chọn ngày
          </label>
          <input type="date" class="form-control mw-20" />

          <div className="mx-20">
            <button className="btn btn-outline-primary">Kích hoạt</button>
          </div>
        </div>
      </div> */
