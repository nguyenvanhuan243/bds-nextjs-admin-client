"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Users } from "@/components/Tables/users";
import { UsersSkeleton } from "@/components/Tables/users/skeleton";
import { Suspense } from "react";

const UsersPage = () => {
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("adminAccessToken")) {
      return window.location.replace("/auth/sign-in");
    }
  }

  return (
    <>
      <Breadcrumb pageName="Users" />
      <div className="space-y-10">

        <Suspense fallback={<UsersSkeleton />}>
          <Users />
        </Suspense>

      </div>
    </>
  );
};

export default UsersPage;
