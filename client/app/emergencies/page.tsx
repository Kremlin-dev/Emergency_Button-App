

import React from "react";
import Breadcrumb from "@/components/molecule/Breadcrumb";
import { EmergenciesProps } from "@/types";
import { DataTable } from "@/components/organism/EmergencyTable";
import { columns } from "@/components/organism/Culomns";
import { emergencieslist } from "@/data";



async function getData(): Promise<EmergenciesProps[]> {
  return emergencieslist;
}

const Emerciencies = async() =>{

  const data = await getData();

  return (
    <div className="p-4 bg-black/5">
      <Breadcrumb />
      <div className="h-[1px] w-full bg-gray-200"></div>
       <main className="container mx-auto py-4">
        <DataTable columns={columns} data={data} />
      </main>
    </div>
  );
}

export default Emerciencies;

