"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { database } from "@/config/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Emergency } from "@/types";

const EmergencyId = () => {
  const { id } = useParams();
  console.log(id);
  const router = useRouter();

  const [incident, setIncident] = useState<Emergency | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [newAction, setNewAction] = useState("");
  const [status, setStatus] = useState("Pending");

  // useEffect(() => {
  //   if (!id) return;

  //   const emergencyRef = ref(database, `emergencies/${id}`);

  //   onValue(emergencyRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data: Emergency = snapshot.val();
  //       setIncident({ id, ...data });

  //       // Load stored actions and status if they exist
  //       const storedActions = localStorage.getItem(`actions-${id}`);
  //       const storedStatus = localStorage.getItem(`status-${id}`);

  //       if (storedActions) setActions(JSON.parse(storedActions));
  //       if (storedStatus) setStatus(storedStatus);
  //     } else {
  //       router.push("/404");
  //     }
  //   });
  // }, [id, router]);

  // // Function to add a new action
  // const addAction = () => {
  //   if (newAction.trim() !== "") {
  //     const updatedActions = [...actions, newAction];
  //     setActions(updatedActions);
  //     setNewAction("");
  //     localStorage.setItem(
  //       `actions-${incident?.id}`,
  //       JSON.stringify(updatedActions)
  //     ); // Save to localStorage
  //   }
  // };

  // // Function to update status and save it
  // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newStatus = e.target.value;
  //   setStatus(newStatus);
  //   localStorage.setItem(`status-${incident?.id}`, newStatus); // Save status
  // };

  // if (!incident) return <p>Loading...</p>;

  return (
    <main className="flex flex-col md:flex-row justify-center p-4 gap-6">
      {/* Left Section - Details Form */}
      {/* <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Emergency Details</h2>

        {/* Readonly Category Input */}
      <label className="block text-sm font-semibold text-gray-700">
        Category:
      </label>
      <input
        type="text"
        value={incident.category}
        readOnly
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-gray-200"
      />

      {/* Actions Input */}
      <label className="block text-sm font-semibold text-gray-700">
        Actions Taken:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter action..."
        />
        <button
          onClick={addAction}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Display Added Actions */}
      <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
        {actions.map((action, index) => (
          <li key={index} className="mt-1">
            {action}
          </li>
        ))}
      </ul>

      {/* Status Select */}
      <label className="block text-sm font-semibold text-gray-700 mt-4">
        Status:
      </label>
      <select
        value={status}
        onChange={handleStatusChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="Pending">Pending</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Resolved">Resolved</option>
      </select>
      {/*} </div> */}

      {/* Right Section - Map */}
      {/* <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Emergency ID: {incident.id} - {incident.companyName}
        </h1>
        <iframe
          src={`https://www.google.com/maps?q=${incident.location?.lat},${incident.location?.lng}&hl=en&z=14&output=embed`}
          width="100%"
          height="450"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div> */}

      <h1>hello</h1>
    </main>
  );
};

export default EmergencyId;
