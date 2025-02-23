"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmergenciesProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { GoDotFill } from "react-icons/go";

export const columns: ColumnDef<EmergenciesProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "emergencyId",
    header: "Emergency ID",
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = (getValue() as string) || "";
      let bgColor = "";
      let textColor = "";

      switch (status.toLowerCase()) {
        case "resolved":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          break;
        case "pending":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          break;
        case "ongoing":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          break;
        default:
          bgColor = "bg-gray-100";
          textColor = "text-gray-800";
      }

      return (
        <div className={`px-2 inline-flex text-xs leading-5 items-center gap-1 font-semibold rounded-sm py-1 ${bgColor} ${textColor}`}>
          <GoDotFill className={`${textColor}`} />
          <p>{status}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
  },
];
