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
import "./style.css";
import { Order } from "@/types/order";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Orders() {
  const [data, setData] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (currentPage: number) => {
    setLoading(true);
    try {
      const adminAccessToken = typeof window !== "undefined" 
        ? window.localStorage.getItem("adminAccessToken") 
        : "";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders`, {
          params: {
            page: currentPage,
            per_page: perPage
          },
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      
      setData(response.data.orders);
      setPerPage(response.data.per_page);
      setPageCount(response.data.total_pages);
    } catch (err) {
      console.log("Orders Error #########", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    if (pageCount === 1) {
      return null;
    }

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
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const handleDelete = (id: number) => {
    // alert("Delete order #########", id);
    console.log("Delete order #########", id);
    const adminAccessToken = typeof window !== "undefined" ? window.localStorage.getItem("adminAccessToken") : "";
    axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${id}`, {
      headers: {
        Authorization: adminAccessToken
      },
    })
    .then(() => {
      console.log("Order deleted successfully");
      toast.success("Order deleted successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      window.location.reload();  
    })
    .catch((err) => {
      console.log("Error deleting order #########", err);
      toast.error("Error deleting order", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      window.location.reload();
    });
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const adminAccessToken = typeof window !== "undefined" 
        ? window.localStorage.getItem("adminAccessToken") 
        : "";

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${orderId}`,
        { order_status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      
      // Refresh the orders list
      fetchOrders(page);
    } catch (err) {
      console.log("Cancel Order Error:", err);
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      const adminAccessToken = typeof window !== "undefined" 
        ? window.localStorage.getItem("adminAccessToken") 
        : "";

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${orderId}`,
        { order_status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      
      // Refresh the orders list
      fetchOrders(page);
    } catch (err) {
      console.log("Cancel Order Error:", err);
    }
  };

  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Orders management
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
                  Order ID
                </TableHead>
                <TableHead>Order Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Created At
                </TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((order) => (
                  <TableRow
                    key={order.id}
                    className="text-base font-medium text-dark dark:text-white"
                  >
                    <TableCell>
                      <div>{order.id}</div>
                    </TableCell>
                    <TableCell>{order.order_link}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.phone_number}</TableCell>
                    <TableCell>{order.order_status}</TableCell>
                    <TableCell>{order.address || 'N/A'}</TableCell>
                    <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          disabled={order.order_status === 'cancelled'}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={order.order_status === 'completed'}
                          onClick={() => handleCompleteOrder(order.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {loading ? "" : "No orders found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="pagination-container">
          {
            pageCount > 1 && (
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
            )
          }
          {renderPageNumbers()}
          
          {
            pageCount > 1 && (
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pageCount || loading}
              >
                Next  
              </button>
            )
          }
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
