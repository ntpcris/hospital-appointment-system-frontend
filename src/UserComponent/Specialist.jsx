import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";

const Specialist = () => {
  const [searchText, setSearchText] = useState(""); // State to hold search input value
  const [specialists, setSpecialists] = useState([]); // State to hold specialist data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addSpecialist, setAddSpecialist] = useState({
    name: "",
    image: "",
    createDate: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (
      !addSpecialist.name ||
      !addSpecialist.image ||
      !addSpecialist.createDate
    ) {
      toast.error("Please complete all information", {
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
    console.log(addSpecialist);
    const formData = new FormData(); // For handling file uploads

    formData.append("name", addSpecialist.name);
    formData.append("image", addSpecialist.image);
    formData.append("createDate", addSpecialist.createDate);

    console.log(formData, "...");
    const response = await fetch(
      "http://localhost:8080/api/specialist/addSpecialist",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      toast.success("Add Specialist Successful", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAddSpecialist({ name: "", image: null, createDate: "" }); // Reset form data
    } else {
      toast.error("Add Specialist Failed", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleInputChangeAddForm = (event) => {
    const { name, value, files } = event.target;

    let updatedData = { ...addSpecialist };

    switch (name) {
      case "name":
        updatedData.name = value;
        break;
      case "createDate":
        updatedData.createDate = value;
        break;
      case "image":
        updatedData.image = files && files[0];
        break;
      default:
        break;
    }
    setAddSpecialist(updatedData);
    console.log(addSpecialist);
  };

  const fetchSpecialists = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/specialist/getAllSpecialist"
    );
    console.log(response);
    return response.data;
  };

  useEffect(() => {
    const getAllSpecialist = async () => {
      const allSpecialist = await fetchSpecialists();
      if (allSpecialist) {
        setSpecialists(allSpecialist);
      }
    };

    getAllSpecialist();
  }, []);

  const handleSearch = (event) => {
    // const newSearchText = event.target.value.toLowerCase();
    // setSearchText(newSearchText);
    // // Filter specialists based on searchText
    // const filteredSpecialists = initialSpecialists.filter((specialist) =>
    //   specialist.name.toLowerCase().includes(newSearchText)
    // );
    // setSpecialists(filteredSpecialists);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    showModal();
  };

  return (
    <div className="specialist-list-container">
      <Modal
        title="Add New Specialist"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={handleOk}>
          <div className="m-3 form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={handleInputChangeAddForm}
              required
            />
          </div>
          <div className="m-3 form-group">
            <label htmlFor="specialistImage">Image:</label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              onChange={handleInputChangeAddForm}
            />
          </div>
          <div className="m-3 form-group">
            <label htmlFor="createDate">Create Date:</label>
            <input
              type="date"
              className="form-control"
              id="createDate"
              name="createDate"
              onChange={handleInputChangeAddForm}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Phần xử lí giao diện management */}
      <div className="fw-bolder fs-3 mb-3">Management Specialist</div>
      <form className="specialist-list-form">
        <div className="m-2 d-flex justify-content-between">
          <input
            type="text"
            placeholder="Search"
            className="search"
            value={searchText}
            onChange={handleSearch}
          />
          <button className="btn btn-outline-primary" onClick={handleAdd}>
            Add New Specialist
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-center">Image</th>
                <th className="text-center">Create Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((specialist) => (
                <tr key={specialist.name}>
                  <td>
                    <span className="text-hover-primary cursor-pointer">
                      {specialist.name}
                    </span>
                  </td>
                  <td className="imageSpecialist">
                    <div className="specialist-image-wrapper">
                      <img
                        src={
                          "http://localhost:8080/api/specialist/" +
                          specialist.image
                        }
                        class="img-fluid"
                        alt="product_pic"
                        style={{
                          maxWidth: "90px",
                        }}
                      />
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-hover-primary">
                      {specialist.createDate}
                    </span>
                  </td>
                  <td className="action">
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="btn btn-primary"
                        style={{
                          marginRight: 10,
                        }}
                        //onClick={handleEditSpecialist}
                      >
                        <i className="fa-sharp fa-regular fa-pen-to-square"></i>
                      </div>
                      <div
                        className="btn btn-danger"
                        style={{
                          marginRight: 10,
                        }}
                        //onClick={handleDeleteSpecialist}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default Specialist;
