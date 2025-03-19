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

  return (
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
                User Name
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
                    <div>{user.full_name || "NAN"}</div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>
                    <button className="text-red-500 hover:text-red-600 hover:underline pr-5">Delete</button>
                  </TableCell>
                  <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                    <button className="text-green-500 hover:text-green-600 hover:underline pr-5">Update</button>
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

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>

        {renderPageNumbers()}

        <button
          className="pagination-button"
          onClick={() => setPage(page + 1)}
          disabled={page >= pageCount || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
