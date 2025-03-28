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
export function Products() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  const fetchPosts = async (currentPage: number) => {
    setLoading(true);
    try {
      const adminAccessToken = typeof window !== "undefined"
        ? window.localStorage.getItem("adminAccessToken")
        : "";

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

      setData(response.data.posts);
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

  const handleDeleteProduct = async (productId: number) => {
    setIsDeleting(true);
    try {
      const adminAccessToken = typeof window !== "undefined"
        ? window.localStorage.getItem("adminAccessToken")
        : "";

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/posts/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setShowDeleteModal(false);
        fetchPosts(page);
      }
    } catch (err) {
      console.log("Delete Product Error #########", err);
    } finally {
      setIsDeleting(false);
    }
  };


  const renderDeleteModal = () => {
    if (showDeleteModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa sản phẩm</h3>
            <p className="mb-6">Bạn có chắc muốn xóa sản phẩm này không?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => handleDeleteProduct(selectedProduct.id)}
              >
                {isDeleting ? "Đang xóa..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

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
          onClick={() => handlePageChange(i)}
        >
          {i}
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
            Quản lí sản phẩm
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
                <TableHead>POST ID</TableHead>
                <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                  Title
                </TableHead>

                <TableHead>Old Price</TableHead>
                <TableHead>New Price</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  Updated At
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((post, index) => (
                  <TableRow
                    key={post.id || index}
                    className="text-base font-medium text-dark dark:text-white"
                  >
                    <TableCell>{post.id}</TableCell>
                    <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                      <div>{post.title || "NAN"}</div>
                    </TableCell>
                    <TableCell>{post.old_price}</TableCell>
                    <TableCell>{post.new_price}</TableCell>
                    <TableCell>{post.created_at}</TableCell>
                    <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                      {post.updated_at}
                    </TableCell>
                    <TableCell>
                      <button
                        style={{ marginRight: '10px' }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={
                          () => {
                            setShowDeleteModal(true)
                            setSelectedProduct(post)
                          }
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
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
        {renderDeleteModal()}
      </div>
    </>
  );
}
