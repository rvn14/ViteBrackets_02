"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {loading ? <p>Loading...</p> :
        users.length ? (
          <ul>
            {users.map((user: any, index) => (
              <li key={user._id}>{index + 1}. {user.username} - {user.totalPoints} points</li>
            ))}
          </ul>
        ) : <p>No users found.</p>
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
