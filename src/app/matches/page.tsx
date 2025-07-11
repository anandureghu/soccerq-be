"use client";
import { supabase } from "@/lib/supabase";
import { Match } from "@/types/types";
import React, { useEffect, useState } from "react";

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("match")
        .select(
          `
          id,
          datetime,
          court,
          goal_team1,
          goal_team2,
          team1:team1 (
            id,
            name
          ),
          team2:team2 (
            id,
            name
          )
        `
        )
        .order("datetime", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        const fixed = (data || []).map((m) => ({
          ...m,
          team1: Array.isArray(m.team1) ? m.team1[0] : m.team1,
          team2: Array.isArray(m.team2) ? m.team2[0] : m.team2,
        }));
        setMatches(fixed as Match[]);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Matches</h1>
        <a
          href="/matches/add"
          className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors duration-200"
        >
          Add Match
        </a>
      </div>

      {loading ? (
        <p>Loading matches...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(match.datetime).toUTCString()} - Court[{match.court}]
              </div>
              <div className="text-lg font-medium">
                {match.team1.name} <strong>{match.goal_team1}</strong> vs{" "}
                <strong>{match.goal_team2}</strong> {match.team2.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
