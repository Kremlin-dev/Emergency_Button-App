"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmergenciesProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

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
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "activities",
    header: "Activities",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created",
    header: "Created",
  },
  {
    accessorKey: "sources",
    header: "Sources",
  },
];