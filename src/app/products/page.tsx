import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Products } from "@/components/Tables/products";
import { ProductsSkeleton } from "@/components/Tables/products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const ProductsPage = () => {
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("adminAccessToken")) {
      return window.location.replace("/auth/sign-in");
    }
  }
  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="space-y-10">

        <Suspense fallback={<ProductsSkeleton />}>
          <Products />
        </Suspense>

      </div>
    </>
  );
};

export default ProductsPage;
