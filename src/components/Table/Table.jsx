//with edit single user

import { Fragment, useEffect, useState } from "react";
import "./Table.scss";
import Select from "../Input/Select";
import InputChecks from "../Input/InputChecks";
import axios from "axios";
import { TableLoading } from "../Loading/TableLoading";
import EditIcon from "../../assets/images/svg/editIcon.svg";
import Image from "next/image";
import Button from "../Button";
import Input from "../Input";
import { adminRoleObject, roleOptions } from "@/helpers/constant";
import { useRouter } from "next/navigation";

const Table = ({
  selectedRole,
  selectedUsers,
  setSelectedUsers,
  loading,
  tableData,
  setTableData,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const router = useRouter();
  const [selectAll, setSelectAll] = useState(false);
  const [editUserId, setEditUserId] = useState(null); // Track the currently edited user
  const [editedUserData, setEditedUserData] = useState({}); // Store the edited user data
  const [filteredData, setFilteredData] = useState([]);

  const handleCheckboxChange = (userId, index, click) => {
    const updatedData = [...tableData];
    if (click === "isActive") {
      updatedData[index].isActive = !updatedData[index].isActive;
      setTableData(updatedData);
      if (userId) {
        axios
          .put(`/api/admin/users/${userId}`, {
            isActive: updatedData[index].isActive,
          })
          .catch((error) => {
            if (error?.response?.status === 401) {
              return router.push("/login");
            }
            console.error("Error updating role:", error);
          });
      }
    }
  };

  const handleSelectAll = () => {
    let newSelectedUsers;
    if (selectAll) {
      newSelectedUsers = new Set();
    } else {
      newSelectedUsers = new Set(tableData.map((user) => user._id));
    }
    setSelectedUsers(newSelectedUsers);
    setSelectAll(!selectAll);
  };

  const handleSelect = (userId) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleEditUser = (userId, userData) => {
    setEditUserId(userId);
    setEditedUserData({ ...userData }); // Load the current user's data into the editable state
  };

  const handleSaveUser = (userId, index) => {
    if (!editedUserData.password) {
      alert("please enter password");
      return;
    }

    if (!editedUserData.email) {
      alert("please enter email");
      return;
    }

    if (!editedUserData?.username) {
      alert("please enter username");
      return;
    }
    const updatedTableData = tableData.map((user) =>
      user._id === userId ? { ...user, ...editedUserData } : user
    );

    axios
      .put(`/api/admin/users/${userId}`, editedUserData)
      .then((response) => {
        setTableData(updatedTableData);
        setEditUserId(null);
        alert("User updated successfully");
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        const message = error?.response?.data?.error || "Something went wrong!";
        alert(message);
        console.error("Error saving user data:", message || error);
      });
  };

  const handleInputChange = (e, field) => {
    setEditedUserData({
      ...editedUserData,
      [field]: e.target.value,
    });
  };

  const handleNameChange = (userId, index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;

    setEditedUserData({
      ...editedUserData,
      [field]: value,
    });
    setTableData(updatedData);
  };

  const generateUserId = (index) => {
    const idNumber = index + 1; // Start from 1
    return `TMP${String(idNumber).padStart(5, "0")}`;
  };

  useEffect(() => {
    const data =
      tableData?.filter(
        (user) => selectedRole === "all" || user.role === selectedRole
      ) || [];
    if (data.length === 0) {
      if (currentPage > 1 && currentPage > totalPages) {
        setCurrentPage(currentPage - 1);
      } else if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData(data);
    }
    setSelectedUsers(new Set());
    setSelectAll(false);
  }, [tableData]);

  return (
    <Fragment>
      <div className="tableScroll overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>
                <InputChecks
                  id="userTableAllSelect"
                  type="checkbox"
                  className="tableCheckbox"
                  name="userTableAllSelect"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Password</th>
              <th>Category</th>
              <th>District</th>
              <th>State</th>
              <th>Active/Inactive</th>
              <th>Edit</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoading />
          ) : (
            <tbody>
              {" "}
              {filteredData.length ? (
                filteredData.map((data, index) => (
                  <tr key={data._id}>
                    <td>
                      <InputChecks
                        id={`userSelect${index}`}
                        type="checkbox"
                        className="tableCheckbox"
                        name={`userSelect${index}`}
                        checked={selectedUsers.has(data._id)}
                        onChange={() => handleSelect(data._id)}
                      />
                    </td>
                    <td className="whitespace-nowrap">
                      {data?.userId || generateUserId(index)}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <div>
                          <Input
                            type="text"
                            value={data?.username}
                            onChange={(e) =>
                              handleNameChange(
                                data._id,
                                index,
                                "username",
                                e.target.value
                              )
                            }
                            placeholder="Full Name"
                          />
                        </div>
                      ) : (
                        data.username
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Input
                          className="mb-0 input-sm"
                          type="number"
                          value={editedUserData.mobile}
                          onChange={(e) => handleInputChange(e, "mobile")}
                        />
                      ) : (
                        data?.mobile
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Input
                          className="mb-0 input-sm"
                          type="text"
                          value={editedUserData.email}
                          onChange={(e) => handleInputChange(e, "email")}
                        />
                      ) : (
                        data?.email
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Input
                          className="mb-0 input-sm"
                          type="text"
                          value={
                            editedUserData.password || editedUserData.mobile
                          }
                          onChange={(e) => handleInputChange(e, "password")}
                        />
                      ) : (
                        data?.password
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Select
                          label="All Category"
                          value={editedUserData.role}
                          options={roleOptions}
                          className="ps-2 pe-10 pt-0 pb-0 border rounded"
                          onChange={(e) => handleInputChange(e, "role")}
                        />
                      ) : (
                        adminRoleObject[data?.role]
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Input
                          className="mb-0 input-sm"
                          type="text"
                          value={editedUserData.district || ""}
                          onChange={(e) => handleInputChange(e, "district")}
                        />
                      ) : (
                        data?.district || "-"
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editUserId === data._id ? (
                        <Input
                          className="mb-0 input-sm"
                          type="text"
                          value={editedUserData.state || ""}
                          onChange={(e) => handleInputChange(e, "state")}
                        />
                      ) : (
                        data?.state || "-"
                      )}
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="toggle bg-primary-content"
                        checked={
                          editUserId === data._id
                            ? editedUserData.isActive
                            : data?.isActive
                        }
                        onChange={() =>
                          handleCheckboxChange(data._id, index, "isActive")
                        }
                      />
                    </td>
                    <td>
                      {editUserId === data._id ? (
                        <Button
                          onClick={() => handleSaveUser(data._id, index)}
                          className="btn btn-primary btn-sm px-5"
                        >
                          Save
                        </Button>
                      ) : (
                        <span
                          onClick={() => handleEditUser(data._id, data)}
                          className="text-center"
                        >
                          <Image
                            src={EditIcon}
                            alt="icon"
                            className="editUser cursor-pointer"
                          />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan="10">No data available</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </Fragment>
  );
};

export default Table;
