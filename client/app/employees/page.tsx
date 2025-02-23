import React from "react";
import Breadcrumb from "@/components/molecule/Breadcrumb";
import { EmployeeProps } from "@/types";
import { EmployeeTable } from "@/components/organism/EmployeeTable";
import { columns } from "@/components/organism/EmployeeCulomn";
import { employeeList } from "@/data";

async function getData(): Promise<EmployeeProps[]> {
  return employeeList;
}

const Employess = async () => {
  const data = await getData();

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

export default Employess;
