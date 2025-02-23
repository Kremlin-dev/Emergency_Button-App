import React from 'react'

function Breadcrumb() {
    return (
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <span className="cursor-pointer hover:underline">Home</span>
          </li>
          <li>/</li>
          <li>
            <span className="font-medium text-gray-800">Tickets</span>
          </li>
        </ol>
      </nav>
    );
  }

export default Breadcrumb