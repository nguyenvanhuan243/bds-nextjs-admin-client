"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import "./users.css";

export function Users() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateFullName, setUpdateFullName] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateAddress, setUpdateAddress] = useState("");
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showUpdateErrorModal, setShowUpdateErrorModal] = useState(false);

  const fetchUsers = async (currentPage: number) => {
    setLoading(true);
    try {
      const adminAccessToken = window.localStorage.getItem("adminAccessToken");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users`, {
        params: {
          page: currentPage,
          per_page: 10
        },
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      }
      );

      setData(response.data.users);
      setPageCount(response.data.total_pages);
    } catch (err) {
      console.log("Users Error #########", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxPages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfMaxPages);
    let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          style={{ width: '50px', height: '50px' }}
          key={i}
          className={`pagination-button ${page === i ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleShowDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    setIsDeleting(true);
    try {
      const adminAccessToken = window.localStorage.getItem("adminAccessToken");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      fetchUsers(page);
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.log("Delete User Error #########", err);
      setShowDeleteModal(false);
      setShowNotFoundModal(true);
    } finally {
      setIsDeleting(false);
      setSelectedUserId(null);
    }
  };

  const handleShowUpdateModal = (userId: number) => {
    const user = data.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setUpdateEmail(user.email);
      setUpdateFullName(user.full_name || "");
      setUpdatePhone(user.phone || "");
      setUpdateAddress(user.address || "");
      setShowUpdateModal(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    if (updateEmail === "" || updateFullName === "" || updatePhone === "" || updateAddress === "") {
      setShowUpdateErrorModal(true);
      setShowUpdateModal(false);
      return;
    }

    setIsUpdating(true);
    try {
      const adminAccessToken = window.localStorage.getItem("adminAccessToken");
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users/${selectedUser.id}`,
        {
          email: updateEmail,
          full_name: updateFullName,
          phone: updatePhone,
          address: updateAddress
        },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      fetchUsers(page);
      setShowUpdateModal(false);
    } catch (err: any) {
      setShowUpdateErrorModal(true);
      setShowUpdateModal(false);
    } finally {
      setIsUpdating(false);
      setSelectedUser(null);
    }
  };

  const renderDeleteModal = () => {
    if (showDeleteModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const renderNotFoundModal = () => {
    if (showNotFoundModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">User not found</h3>
            <p className="mb-6">Please try again</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowNotFoundModal(false)}
              >
                Yes, I will try again
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const renderUpdateModal = () => {
    if (showUpdateModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={updateFullName}
                  onChange={(e) => setUpdateFullName(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={updateEmail}
                  onChange={(e) => setUpdateEmail(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={updatePhone}
                  onChange={(e) => setUpdatePhone(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={updateAddress}
                  onChange={(e) => setUpdateAddress(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowUpdateModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                onClick={handleUpdateUser}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const renderPreviousButton = () => {
    return (
      <button
        className="pagination-button"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1 || loading}
      >
        Previous
      </button>
    )
  }

  const renderNextButton = () => {
    return (
      <button
        className="pagination-button"
        onClick={() => setPage(page + 1)}
        disabled={page >= pageCount || loading}
      >
        Next
      </button>
    )
  }

  const renderUpdateErrorModal = () => {
    if (showUpdateErrorModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update User Error</h3>
            <p className="mb-6">
              Your data is not valid, please try again
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowUpdateErrorModal(false)}
              >
                Yes, I will try again
              </button>
            </div>
          </div>
        </div>
      )
    }
  }


  const renderPagination = () => {
    return (
      <div className="pagination-container">
        {
          renderPreviousButton()
        }

        {
          renderPageNumbers()
        }

        {
          renderNextButton()
        }
      </div>
    )
  }

  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Users management
          </h2>
        </div>

        <div className="table-container">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                  User ID
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  Delete Action
                </TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Update Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((user, index) => (
                  <TableRow
                    key={user.id || index}
                    className="text-base font-medium text-dark dark:text-white"
                  >
                    <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                      <div>{user.id || "NAN"}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.user_type}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleShowDeleteModal(user.id)}
                        className="text-red-500 hover:text-red-600 hover:underline pr-5"
                      >
                        Delete
                      </button>
                    </TableCell>
                    <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                      <button
                        onClick={() => handleShowUpdateModal(user.id)}
                        className="text-green-500 hover:text-green-600 hover:underline pr-5"
                      >
                        Update
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {loading ? "" : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {
          renderPagination()
        }
      </div>

      {
        renderDeleteModal()
      }
      {
        renderUpdateModal()
      }
      {
        renderNotFoundModal()
      }
      {
        renderUpdateErrorModal()
      }
    </>
  );
}
