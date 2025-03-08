import PlayerCard, { Player } from '@/components/playerCard';

async function getPlayerById(id: string): Promise<Player | null> {
  // In a real app, fetch from your DB or /api/players/:id
  // Example mock data:
  const mockPlayers: Player[] = [
    {
      _id: '1',
      name: 'Virat Kohli',
      university: 'Delhi Uni',
      runs: 12000,
      balls_faced: 11000,
      innings_played: 250,
      wickets: 0,
      overs_bowled: 0,
      runs_conceded: 0,
      category: 'Batsman',
      value: 500000,
      points: 120
    },
    {
      _id: '2',
      name: 'Lasith Malinga',
      university: 'Colombo Uni',
      runs: 600,
      balls_faced: 800,
      innings_played: 40,
      wickets: 200,
      overs_bowled: 1500,
      runs_conceded: 1200,
      category: 'Bowler',
      value: 400000,
      points: 90
    },
    {
      _id: '3',
      name: 'Ben Stokes',
      university: 'Leeds Uni',
      runs: 5000,
      balls_faced: 5200,
      innings_played: 120,
      wickets: 150,
      overs_bowled: 2400,
      runs_conceded: 2200,
      category: 'All-rounder',
      value: 800000,
      points: 180
    }
  ];
  return mockPlayers.find((p) => p._id === id) || null;
}

interface PlayerDetailPageProps {
  params: { id: string };
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const player = await getPlayerById(params.id);

  if (!player) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Player not found</h2>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Player Details</h2>
      <PlayerCard player={player} />
    </div>
  );
}