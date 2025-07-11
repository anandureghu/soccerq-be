"use client";
import { supabase } from "@/lib/supabase";
import { Team } from "@/types/types";
import React, { useEffect, useState } from "react";

const TeamPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from("team").select("*");
      if (error) {
        setError(error.message);
      } else {
        setTeams(data as Team[]);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <a
          href="/team/add"
          className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors duration-200"
        >
          Add Team
        </a>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="p-3 border border-gray-200 rounded-md shadow-sm"
            >
              {team.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamPage;
