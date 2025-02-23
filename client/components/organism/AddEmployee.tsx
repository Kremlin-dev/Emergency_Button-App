"use client";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EmployeeForm from "./EmployeeForm";

function AddEmployee() {
 
  return (
    <SheetContent className="sm:max-w-[700px] max-h-[700px] overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Add Employee</SheetTitle>
        <SheetDescription>
          Enter the details for the new employee and click Save&quot; when done.
        </SheetDescription>
      </SheetHeader>

      <EmployeeForm />
      
    </SheetContent>
  );
}

export default AddEmployee;