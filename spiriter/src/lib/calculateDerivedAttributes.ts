// lib/calculateDerivedAttributes.ts
export interface DerivedAttributes {
    battingStrikeRate: number;
    battingAverage: number;
    bowlingStrikeRate: number;
    economyRate: number;
    playerPoints: number;
    playerValue: number;
  }
  
  /**
   * Given a player's raw stats, compute all derived attributes.
   * None of these are saved to Mongo; they're purely calculated.
   */
  export function calculateDerivedAttributes(stats: {
    totalRuns?: number;
    totalBallsFaced?: number;
    inningsPlayed?: number;
    totalBallsBowled?: number;
    totalWicketsTaken?: number;
    totalRunsConceded?: number;
  }): DerivedAttributes {
    const {
      totalRuns = 0,
      totalBallsFaced = 0,
      inningsPlayed = 0,
      totalBallsBowled = 0,
      totalWicketsTaken = 0,
      totalRunsConceded = 0
    } = stats;
  
    // Basic safety checks to avoid divide-by-zero
    const battingStrikeRate = totalBallsFaced > 0
      ? (totalRuns / totalBallsFaced) * 100
      : 0;
  
    const battingAverage = inningsPlayed > 0
      ? (totalRuns / inningsPlayed)
      : 0;

    // 
    const bowlingStrikeRate = totalWicketsTaken > 0
      ? (totalBallsBowled / totalWicketsTaken)* 6
      : 0;
  
    const economyRate = totalBallsBowled > 0
      ? (totalRunsConceded / totalBallsBowled) 
      : 0;
  
    // Using your formula:
    // Player Points = (battingStrikeRate / 5) + (battingAverage * 0.8) + (500 / bowlingStrikeRate) + (140 / economyRate)
    //   (Take care of 0 for bowlingStrikeRate or economyRate to avoid division by zero)
    let playerPoints = 0;
    playerPoints += battingStrikeRate / 5;
    playerPoints += battingAverage * 0.8;
    if (bowlingStrikeRate > 0) {
      playerPoints += 500 / bowlingStrikeRate;
    }
    if (economyRate > 0) {
      playerPoints += 140 / economyRate;
    }
  
    // Next, Player Value in rupees = (9 × Points + 100) × 1000
    // Then round to nearest multiple of 50,000
    const rawValue = (9 * playerPoints + 100) * 1000;
  
    function roundToNearest50000(val: number): number {
      const remainder = val % 50000;
      return remainder < 25000 ? val - remainder : val + (50000 - remainder);
    }
  
    const playerValue = roundToNearest50000(rawValue);
  
    return {
      battingStrikeRate,
      battingAverage,
      bowlingStrikeRate,
      economyRate,
      playerPoints,
      playerValue
    };
  }
  
