import requests
from typing import List, Dict
from src.config.settings import CORS_ORIGINS

def get_best_eleven() -> List[Dict]:
    """
    Retrieves all players from the API, sorts them by player points,
    and returns the top 11 players.
    
    Returns:
        List[Dict]: List of 11 players with highest player points
    """
    try:
        # Make GET request to the API
        response = requests.get(f"{CORS_ORIGINS}/api/players")
        
        # Check if request was successful
        response.raise_for_status()
        
        # Get players data
        players = response.json()
        
        # Sort players by playerPoints in descending order
        sorted_players = sorted(players, key=lambda x: x['playerPoints'], reverse=True)
        
        # Get top 11 players and extract only their names
        return [player['name'] for player in sorted_players[:11]]
        
    except requests.RequestException as e:
        print(f"Error fetching players: {str(e)}")
        return []