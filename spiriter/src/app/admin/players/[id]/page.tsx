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
        const response = await fetch(`/api/players/${id}`);
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
      const response = await fetch(`/api/players/${id}`, {
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
      const response = await fetch(`/api/players/${id}`, {
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
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Player Details</h1>

      {/* Editable Fields */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-gray-700">Name:</span>
          <input
            type="text"
            name="Name"
            value={player.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">University:</span>
          <input
            type="text"
            name="University"
            value={player.university}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Category:</span>
          <select
            name="Category"
            value={player.Category}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
          </select>
        </label>

        {/* Stats Section */}
        <h2 className="text-lg font-semibold mt-4">Statistics</h2>
        {["runs", "ballsFaced", "inningsPlayed", "wickets", "oversBowled", "runsConceded"].map(
          (stat) => (
            <label key={stat} className="block">
              <span className="text-gray-700">{stat}:</span>
              <input
                type="number"
                name={stat}
                value={player[stat]}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border p-2 rounded ${isEditing ? "bg-white" : "bg-gray-100"}`}
              />
            </label>
          )
        )}

        {/* Computed Stats - Read-Only */}
        <h2 className="text-lg font-semibold mt-4">Derived Statistics</h2>
        <p>Batting Strike Rate: {player.battingStrikeRate}</p>
        <p>Batting Average: {player.battingAverage}</p>
        <p>Bowling Strike Rate: {player.bowlingStrikeRate}</p>
        <p>Economy Rate: {player.economyRate}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>

          <button
            onClick={() => router.push("/admin/players")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
