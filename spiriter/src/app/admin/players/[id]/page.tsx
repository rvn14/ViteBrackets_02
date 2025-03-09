"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PlayerDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Get player ID from URL
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch player details
  useEffect(() => {
    async function fetchPlayer() {
      try {
        const response = await fetch(`/api/admin/players/${id}`);
        const data = await response.json();
        console.log("Fetched Player:", data);
        setPlayer(data);
      } catch (error) {
        console.error("Error fetching player details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  // Save edited player details
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });

      if (response.ok) {
        alert("Player updated successfully!");
        setIsEditing(false);
      } else {
        console.error("Failed to update player");
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  // Delete player & navigate back
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;

    try {
      const response = await fetch(`/api/admin/players/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Player deleted successfully!");
        router.push("/admin/players"); // Redirect back to players list
      } else {
        console.error("Failed to delete player");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!player) return <p>Player not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white/10 border-1 border-white/20 backdrop-blur-lg shadow-md rounded-lg">

      {/* Header Image */}
      <img
        src="https://www.shareicon.net/data/128x128/2016/06/27/787169_people_512x512.png"
        alt="Players Icon"
        className="mx-auto mb-4"
      />

      <h1 className="text-2xl font-bold mb-4 text-white text-center">Player Details</h1>

      {/* Editable Fields */}
      <div className="space-y-2">
        <label className="block ">
          <span className="text-white/80">Name:</span>
          <input
            type="text"
            name="Name"

            value={player.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 rounded outline-0 text-white ${isEditing ? "bg-white/10 border-2 border-white/20" : "bg-white/20"}`}
          />
        </label>

        <label className="block">
          <span className="text-white/80">University:</span>
          <input
            type="text"
            name="University"
            value={player.university}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 rounded outline-0 text-white ${isEditing ? "bg-white/10 border-2 border-white/20" : "bg-white/20"}`}
          />
        </label>

        <label className="block">
          <span className="text-white/80">Category:</span>
          <select
            name="category"
            value={player.category}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 rounded outline-0 text-white ${isEditing ? "bg-white/10 border-2 border-white/20" : "bg-white/20"}`}
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
          </select>
        </label>

        {/* Stats Section */}
        <h2 className="text-lg font-semibold mt-4 text-white">Statistics</h2>
        <div className="grid grid-cols-2 gap-2">

        {["runs", "ballsFaced", "inningsPlayed", "wickets", "oversBowled", "runsConceded"].map(
          (stat) => (
            <label key={stat} className="block">
              <span className="text-white/80 capitalize">{stat.replace(/([A-Z])/g, " $1")}:</span>
              <input
                type="number"
                name={stat}
                value={player[stat]}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 rounded outline-0 text-white ${isEditing ? "bg-white/10 border-2 border-white/20" : "bg-white/20"}`}
              />
            </label>
          )
        )}
        </div>
        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-8 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-green-600 text-white rounded cursor-pointer"
            >
              Save
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-8 py-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Delete
          </button>

          <button
            onClick={() => router.push("/admin/players")}
            className="px-8 py-2 bg-gray-500 text-white rounded cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
