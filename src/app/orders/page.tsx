"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Orders } from "@/components/Tables/orders";
import { OrdersSkeleton } from "@/components/Tables/orders/skeleton";

import { Suspense } from "react";


const TablesPage = () => {
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("adminAccessToken")) {
      return window.location.replace("/auth/sign-in");
    }
  }
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="space-y-10">

        <Suspense fallback={<OrdersSkeleton />}>
          <Orders />
        </Suspense>

      </div>
    </>
  );
};

export default TablesPage;
