"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

export default function AddPlayerPage() {
  const router = useRouter();

  // Player fields
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [category, setCategory] = useState<
    "Batsman" | "Bowler" | "All-Rounder"
  >("Batsman");

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

    // Show confirmation dialog using SweetAlert
    const willSave = await swal({
      title: "Confirm Save",
      text: "Are you sure you want to save this player?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
      dangerMode: true,
    });

    if (!willSave) return; // Exit if user cancels

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
        credentials: "include", // ensures cookies are sent
        body: JSON.stringify(playerData),
      });

      if (!res.ok) throw new Error("Failed to add player");

      swal("Success", "Player added successfully!", "success");
      router.push("/admin/players"); // Navigate back to players list
    } catch (err: any) {
      swal("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md shadow-md rounded-lg border border-white/20 px-4 sm:px-8 py-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Add New Player
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  University
                </label>
                <input
                  type="text"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category and Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Category
                </label>
                <select
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as typeof category)
                  }
                >
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-Rounder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white border-b border-white/20 pb-1">
              Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Total Runs
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={runs}
                  onChange={(e) => setRuns(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Balls Faced
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={ballsFaced}
                  onChange={(e) => setBallsFaced(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Innings Played
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={inningsPlayed}
                  onChange={(e) => setInningsPlayed(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Wickets
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={wickets}
                  onChange={(e) => setWickets(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Overs Bowled
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={oversBowled}
                  onChange={(e) => setOversBowled(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Runs Conceded
                </label>
                <input
                  type="number"
                  className="w-full rounded outline-0 text-white bg-white/10 border-2 border-white/20 p-2"
                  value={runsConceded}
                  onChange={(e) => setRunsConceded(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push("/admin/players")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full sm:w-1/2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-1/2 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
