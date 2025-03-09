"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function AddPlayerPage() {
  const router = useRouter();

  // Player fields
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [category, setCategory] = useState<"Batsman" | "Bowler" | "All-rounder">("Batsman");

  // Stats fields
  const [runs, setRuns] = useState(0);
  const [ballsFaced, setBallsFaced] = useState(0);
  const [inningsPlayed, setInningsPlayed] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [oversBowled, setOversBowled] = useState(0);
  const [runsConceded, setRunsConceded] = useState(0);

  // Additional Fields
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // ** Handle Form Submission **
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const playerData = {
        Name: name,
        University: university,
        Category: category,
        "Total Runs": runs,
        "Balls Faced": ballsFaced,
        "Innings Played": inningsPlayed,
        Wickets: wickets,
        "Overs Bowled": oversBowled,
        "Runs Conceded": runsConceded,
        value,
      };

      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      });

      if (!res.ok) throw new Error("Failed to add player");

      alert(`Player added successfully!`);
      router.push("/admin/players"); // Navigate back to players list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Player</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="border w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">University</label>
          <input
            type="text"
            className="border w-full p-2"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="border w-full p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
          </select>
        </div>

        {/* Stats Section */}
        <h3 className="text-lg font-semibold mt-4">Statistics</h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Total Runs</label>
            <input
              type="number"
              className="border w-full p-2"
              value={runs}
              onChange={(e) => setRuns(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Balls Faced</label>
            <input
              type="number"
              className="border w-full p-2"
              value={ballsFaced}
              onChange={(e) => setBallsFaced(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Innings Played</label>
            <input
              type="number"
              className="border w-full p-2"
              value={inningsPlayed}
              onChange={(e) => setInningsPlayed(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Wickets</label>
            <input
              type="number"
              className="border w-full p-2"
              value={wickets}
              onChange={(e) => setWickets(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Overs Bowled</label>
            <input
              type="number"
              className="border w-full p-2"
              value={oversBowled}
              onChange={(e) => setOversBowled(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Runs Conceded</label>
            <input
              type="number"
              className="border w-full p-2"
              value={runsConceded}
              onChange={(e) => setRunsConceded(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Value</label>
          <input
            type="number"
            className="border w-full p-2"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

