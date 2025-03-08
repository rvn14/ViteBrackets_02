"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BudgetView() {
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBudget = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setError("User not found.");
        return;
      }

      try {
        const res = await axios.get(`/api/budget?userId=${user.id}`);
        setBudget(res.data.budget);
      } catch (err) {
        setError("Failed to load budget.");
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, []);

  return (
    <div>
      <h2>Budget Overview</h2>
      {loading ? <p>Loading budget...</p> : <h3>Remaining Budget: Rs.{budget?.toLocaleString()}</h3>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
