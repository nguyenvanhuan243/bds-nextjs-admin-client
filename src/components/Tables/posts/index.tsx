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

const paginationStyles = `
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
  }

  .pagination-button {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pagination-button:hover:not(:disabled) {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  .pagination-button.active {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .table-container {
    position: relative;
    min-height: 200px;
  }
`;

export function Posts() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (currentPage: number) => {
    setLoading(true);
    try {
      const adminAccessToken = window.localStorage.getItem("adminAccessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/posts`, {
          params: {
            page: currentPage,
            per_page: perPage
          },
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      console.log("Posts #########", response.data.posts);
      setData(response.data.posts);
      console.log("Posts #########", response.data.posts);
      setPerPage(response.data.per_page);
      setPageCount(response.data.total_pages);
    } catch (err) {
      console.log("Posts Error #########", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPageNumbers = () => {
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
      <style>{paginationStyles}</style>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Posts management
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
                  Title
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Updated At
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((post, index) => (
                  <TableRow
                    key={post.id || index}
                    className="text-base font-medium text-dark dark:text-white"
                  >
                    <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                      <div>{post.title || "NAN"}</div>
                    </TableCell>
                    <TableCell>{post.description}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>{post.created_at}</TableCell>
                    <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                      {post.updated_at}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {loading ? "" : "No posts found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>

          {renderPageNumbers()}
          
          <button
            className="pagination-button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pageCount || loading}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
} 