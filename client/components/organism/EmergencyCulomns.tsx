"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { GoDotFill } from "react-icons/go";
import { Emergency } from "@/types";

export const columns: ColumnDef<Emergency>[] = [
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
    cell: () => (
      <div className="px-2 inline-flex text-xs leading-5 items-center gap-1 font-semibold rounded-sm py-1 bg-green-100 text-green-800">
        <GoDotFill className="text-green-800" />
        <p>Resolved</p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ getValue }) => {
      const rawDate = getValue() as string;
      const formattedDate = new Date(rawDate).toISOString().split("T")[0];
      return <span>{formattedDate}</span>;
    },
  },
];
