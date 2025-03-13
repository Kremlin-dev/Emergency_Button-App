"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/molecule/Breadcrumb";
import { EmployeeProps } from "@/types";
import { EmployeeTable } from "@/components/organism/EmployeeTable";
import { columns } from "@/components/organism/EmployeeCulomn";
import { employeeList } from "@/data";
import Loader from "@/components/molecule/Loader";

const Employees = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string; department: string } | null>(null);
  const [data, setData] = useState<EmployeeProps[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login"); 
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setData(employeeList.filter(emp => emp.department === parsedUser.department)); 
    }
  }, [router]);

  if (!user) return <Loader/>

  return (
    <div className="p-4 bg-black/5">
      <Breadcrumb />
      <div className="h-[1px] w-full bg-gray-200"></div>
      <main className="container mx-auto py-4">
        <EmployeeTable columns={columns} data={data} />
      </main>
    </div>
  );
};

export default Employees;
