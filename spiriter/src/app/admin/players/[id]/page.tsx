"use client";

import { useState, useEffect } from 'react';


function Dashboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('/api/players');
        const data = await response.json();
        console.log('Fetched Players:', data);

        if (Array.isArray(data)) {
          setPlayers(data);
          setFilteredPlayers(data);
        } else {
          console.error('Unexpected data format:', data);
          setPlayers([]);
          setFilteredPlayers([]);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch('/api/users/me'); // Adjust endpoint if needed
        const data = await response.json();
        console.log('Fetched User Details:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchPlayers();
    fetchUserDetails();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render players and user details accordingly */}
    </div>
  );
}

export default Dashboard;
