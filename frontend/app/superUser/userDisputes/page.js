"use client";

import React, { useState, useEffect } from "react";

export default function UserDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Disputes</h1>

      {loading && <p>Loading disputes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && disputes.length === 0 && (
        <p>No disputes to show.</p>
      )}

      {!loading && !error && disputes.length > 0 && (
        <ul className="list-disc list-inside">
          {disputes.map((dispute, index) => (
            <li key={index}>
              {dispute.description || JSON.stringify(dispute)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
