"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/molecule/Loader";
import { useRouter } from "next/navigation";
import { EmployeeTable } from "@/components/organism/EmployeeTable";
import { columns } from "@/components/organism/EmployeeCulomn";

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  phone: string | null;
  registered: boolean;
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const companyCode = localStorage.getItem("companyCode");
        if (!companyCode) throw new Error("Company code not found. Redirecting...");

        const response = await fetch(`https://kremlin.pythonanywhere.com/company-employees/${companyCode}/`);

        if (!response.ok) throw new Error("Failed to fetch employees");

        let text = await response.text();

        text = text.replace(/NaN/g, "null");

        const data = JSON.parse(text);


        if (!data.employees || !Array.isArray(data.employees)) {
          throw new Error("Invalid data format received");
        }

        const formattedEmployees = data.employees.map((emp: any) => ({
          ...emp,
          phone: typeof emp.phone === "string" && emp.phone.trim() !== "" ? emp.phone : "N/A",
        }));

        setEmployees(formattedEmployees);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);



  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-4 bg-black/5">
     <section className="p-4">
      <EmployeeTable data={employees} columns={columns}/>
     </section>
    </main>
  );
};

export default EmployeesPage;
