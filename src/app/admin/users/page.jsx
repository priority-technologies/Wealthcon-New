"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import UserUploader from "../../../components/Modal/UserUploader";
import UploadIcon from "../../../assets/images/svg/addIcon.svg";
import TrashIcon from "../../../assets/images/svg/trashIcon.svg";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import Select from "../../../components/Input/Select";
import Table from "../../../components/Table";
import axios from "axios";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { debounce } from "@/helpers/all";
import Input from "@/components/Input";
import { roleOptions } from "@/helpers/constant";

const Filter = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [tableData, setTableData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  let cancelToken;

  const handleFilterChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const handleProcessSelected = async () => {
    const mySelectedUser = Array.from(selectedUsers);
    if (mySelectedUser.length > 0) {
      const confirmed = window.confirm(
        "Are you sure you want to delete the selected users?"
      );

      if (confirmed) {
        setDeleteLoading(true);
        try {
          await axios.delete(`/api/admin/users/${mySelectedUser[0]}`, {
            data: { userIds: mySelectedUser },
            headers: { "Content-Type": "application/json" },
          });

          alert("Users deleted successfully");
          const newTableData = tableData.filter(
            (user) => !mySelectedUser.includes(user._id)
          );
          setTotalItem((presVal) => presVal - mySelectedUser.length);
          setTableData(newTableData);
          setSelectedUsers(new Set());

          if (newTableData.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            router.push("/login");
          }
          console.error("Error deleting users:", error);
        } finally {
          setDeleteLoading(false);
        }
      }
    }
  };

  const fetchUsers = async (page, role, searchTerm) => {
    setLoading(true);

    if (cancelToken) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = axios.CancelToken.source();

    try {
      const params = {
        category: role === "all" ? null : role,
        page,
        search: searchTerm || undefined, // Only include search param if searchTerm exists
      };

      let res = await axios.get("/api/admin/users", {
        params,
        cancelToken: cancelToken.token,
      });

      if (res.status === 200) {
        setSelectedUsers(new Set());
        setTableData(res.data);
        setCurrentPage(Number(res.headers["x-current-page"]));
        setTotalPages(Number(res.headers["x-total-pages"]));
        setTotalItem(Number(res.headers["x-total-item"]));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (error?.response?.status === 401) {
        router.push("/login");
      } else {
        console.error("Error fetching users:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of fetchUsers
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), []);

  // Fetch users when pagination or filter changes
  useEffect(() => {
    debouncedFetchUsers(currentPage, selectedRole, searchTerm);
  }, [currentPage, selectedRole, searchTerm, debouncedFetchUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Fragment>
      <div className="flex justify-between items-center flex-wrap mb-5 gap-3">
        <Typography
          tag="h1"
          size="text-xl"
          weight="font-semibold"
          color="text-base-content"
          className="block text-left"
        >
          User Management
        </Typography>
        <div className="user-search filter-wrapper flex justify-start items-center flex-wrap gap-2">
          {/* Search bar */}
          <Input
            type="text"
            placeholder="Search by full name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2"
          />

          <Button
            icon={TrashIcon}
            iconPosition="left"
            className="bg-red-600 border-red-600 btn-sm"
            onClick={handleProcessSelected}
            disabled={selectedUsers.size === 0}
            loading={deleteLoading}
          >
            <span className="md:block hidden">Delete</span>
          </Button>
          <Button
            icon={UploadIcon}
            iconPosition="left"
            className="btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            <span className="md:block hidden">Add User</span>
          </Button>
          <UserUploader
            fetchUsers={fetchUsers}
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <Select
            value={selectedRole}
            onChange={handleFilterChange}
            options={[{ label: "All Category", value: "all" }, ...roleOptions]}
            className="border rounded-none w-full p-4 pr-10"
          />
        </div>
      </div>

      <Table
        selectedRole={selectedRole}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        loading={loading}
        tableData={tableData}
        setTableData={setTableData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItem={totalItem}
        onPageChange={setCurrentPage}
      />
    </Fragment>
  );
};

export default Filter;
