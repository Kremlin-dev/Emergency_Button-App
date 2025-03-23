"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
      const companyCode = localStorage.getItem("companyCode");

      if (!companyCode) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (isAuthenticated === null) {
      return <Loader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
