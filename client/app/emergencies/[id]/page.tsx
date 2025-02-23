import React from "react";
import Breadcrumb from "@/components/molecule/Breadcrumb";

interface EmergencyIdProps {
  params: {
    id: string;
  };
}

const EmergencyId = ({ params }: EmergencyIdProps) => {
  return (
    <main>
      <div className="mt-4 px-3">
        <Breadcrumb />
        <div className="h-[1px] w-full mt-[-10px] bg-gray-200"></div>
      </div>

      <section className="flex gap-4 sm:justify-between m-4 flex-col md:flex-row justify-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emergency ID: {params.id}
          </h1>
        </div>

        <div className="w-full md:w-2/3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.45502109239!2d-1.6749284264980742!3d6.203550326801767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdc6f8899191fbb%3A0x5efde98eab835fc8!2sOBUASI%20GOLD%20MINE!5e0!3m2!1sen!2sgh!4v1740320633300!5m2!1sen!2sgh"
            width="100%"
            height="450"
            style={{border:"0"}}
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default EmergencyId;
