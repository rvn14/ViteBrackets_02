'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPlayerPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [category, setCategory] = useState<'Batsman' | 'Bowler' | 'All-rounder'>('Batsman');
  const [value, setValue] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, POST to your backend:
      // const res = await fetch('/api/players', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, university, category, value })
      // });
      // if (!res.ok) throw new Error('Failed to add player');
      // Optionally handle the response
      alert(`Player added: ${name}, ${university}, ${category}, value=${value}`);
      // Navigate back to players listing
      router.push('/players');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Player</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
