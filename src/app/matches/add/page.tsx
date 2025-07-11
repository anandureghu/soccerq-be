"use client";
import { supabase } from "@/lib/supabase";
import { Team } from "@/types/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AddMatch = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [datetime, setDatetime] = useState("");
  const [court, setCourt] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [message, setMessage] = useState("");

  // Fetch teams on load
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase.from("team").select("*");

      if (data) setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime || !court || !team1 || !team2 || team1 === team2) {
      setMessage("Please fill all fields correctly.");
      return;
    }

    const { error } = await supabase.from("match").insert([
      {
        datetime,
        court,
        team1,
        team2,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
      toast.error(error.message);
    } else {
      setMessage("Match successfully added!");
      // Optionally clear the form
      setDatetime("");
      setCourt("");
      setTeam1("");
      setTeam2("");
      toast.success("Match added successfully!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-semibold">Add Match Details</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          className="border-b border-gray-300 outline-none p-2"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Court"
          className="border-b border-gray-300 outline-none p-2"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
        />

        <label htmlFor="team1" className="text-sm text-gray-500 pt-2">
          Team 1
        </label>
        <select
          className="border-b border-gray-300 outline-none pb-2"
          id="team1"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
        >
          <option value="">Select Team 1</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <label htmlFor="team2" className="text-sm text-gray-500 pt-2">
          Team 2
        </label>
        <select
          className="border-b border-gray-300 outline-none pb-2"
          id="team2"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
        >
          <option value="">Select Team 2</option>
          {teams
            .filter((team) => team.id !== team1) // 🧠 Filter out selected team1
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors duration-200 cursor-pointer"
        >
          Submit
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default AddMatch;
