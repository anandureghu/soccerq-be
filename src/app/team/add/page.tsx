"use client";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { toast } from "sonner";

const AddTeam = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Team name cannot be empty");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("team").insert([{ name }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
      toast.error(error.message);
    } else {
      setMessage(`Team "${name}" added!`);
      setName(""); // reset form
      toast.success(`Team "${name}" added!`);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-semibold">Add New Team</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team Name"
          className="border-b border-gray-300 outline-none p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Adding..." : "Submit"}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default AddTeam;
