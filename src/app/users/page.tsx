"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";
import { Suspense } from "react";

const TablesPage = () => {
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("adminAccessToken")) {
      return window.location.replace("/auth/sign-in");
    }
  }

  return (
    <>
      <Breadcrumb pageName="Users" />
      <div className="space-y-10">

        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense>

      </div>
    </>
  );
};

export default TablesPage;
