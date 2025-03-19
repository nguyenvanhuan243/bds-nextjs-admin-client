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

export function Orders() {
  const [data, setData] = useState<any[]>([]);
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

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-button"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-button" style={{ cursor: 'default' }}>
            ...
          </span>
        );
      }
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

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-button" style={{ cursor: 'default' }}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pageCount}
          className="pagination-button"
          onClick={() => handlePageChange(pageCount)}
        >
          {pageCount}
        </button>
      );
    }

    return pages;
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
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Created At
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((order, index) => (
                  <TableRow
                    key={order.id || index}
                    className="text-base font-medium text-dark dark:text-white"
                  >
                    <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                      <div>{order.id || "NAN"}</div>
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                      {order.created_at}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
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
      </div>
    </>
  );
}
