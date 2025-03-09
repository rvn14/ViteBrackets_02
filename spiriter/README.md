Spirit11: Inter-University Fantasy Cricket League

Welcome to Spirit11, a fantasy cricket league that lets users select university cricket players, manage budgets, and compete on a leaderboard – all integrated with real-time updates and user authentication.

Table of Contents

Features
Project Structure
Setup & Installation
Environment Variables
Usage
Authentication
Players View
Select Team
Team Page
Budget Tracking
Leaderboard
API Routes
Technologies
License
Features

User Authentication
Users can sign up and log in with a username & password.
Only authenticated users can access “Players,” “Select Team,” “Team,” and “Leaderboard.”
Players Tab
Displays all available players with their basic stats (runs, wickets, etc.).
Points of each player are hidden from the user, per spec.
Select Team
Users pick up to 11 players from the list, track leftover budget.
Prevent duplicates; only add players if the user has enough leftover budget.
Shows partial or complete team.
Team Page
Displays the user’s selected 11 players with their calculated total points (only once the team has 11 players).
Allows removing any player from the team (and budget is refunded).
Budgeting
Each user starts with Rs.9,000,000.
Each player has a playerValue.
If total cost of chosen players exceeds leftover budget, the user can’t add more.
Removing a player refunds that value back to leftover budget.
On saving, the server finalizes leftover budget in the Users collection.
Leaderboard
Shows all users sorted in descending order by total points.
Highlights the logged-in user.
Real-time (optional advanced feature)
Could use websockets or SSE to reflect updated stats instantly (if required).
Project Structure

spirit11/
├── lib/
│   ├── calculateDerivedAttributes.ts   # Logic to compute player points & value
│   └── mongodb.ts                      # MongoDB connection
├── models/
│   ├── Player.ts                       # Mongoose schema for players
│   └── User.ts                         # Mongoose schema for users
├── src/
│   ├── app/
│   │   ├── select-team/
│   │   │   └── page.tsx                # "Select Team" page (UI + budget logic)
│   │   ├── team/
│   │   │   └── page.tsx                # "Team" page, displays selected players
│   │   ├── leaderboard/
│   │   │   └── page.tsx                # Leaderboard UI
│   │   ├── api/
│   │   │   ├── players/
│   │   │   │   └── [id]/route.ts       # Players CRUD + GET (calc points on-the-fly)
│   │   │   ├── teams/
│   │   │   │   └── [id]/route.ts       # Team logic, saves user team & budget
│   │   │   └── leaderboard/
│   │   │       └── route.ts           # Leaderboard data (sorts by user.totalPoints)
│   └── ...
├── package.json
├── README.md                           # This readme
└── ...
Setup & Installation

Clone the Repo
git clone https://github.com/YourUser/spirit11.git
cd spirit11
Install Dependencies
npm install
# or
yarn
Configure MongoDB in .env or .env.local:
MONGODB_URI=mongodb+srv://user:pass@cluster.example.com/spirit11
JWT_SECRET=some_secret_key
Run the Dev Server
npm run dev
# or
yarn dev
Visit http://localhost:3000
Environment Variables

Typical .env.local:

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>
JWT_SECRET=someRandomString
NEXTAUTH_SECRET=someRandomString
Usage

Authentication
Sign Up: create an account with username & password.
Log In: get a session or token stored (depending on your approach).
If user is not logged in, block access to main features.
Players View
GET /api/players fetches the raw stats for each player.
The UI shows runs, wickets, and other basic stats, but not player points.
Select Team
The user sees a list of players.
They can add up to 11 players, with checks for leftover budget.
On saving, the server re-checks cost vs. user budget, updates leftover budget in the DB.
Team Page
Shows the user’s selected players if any.
If team.length === 11, displays total points.
Player removal is allowed.
Budget Tracking
Each user’s leftover budget is stored in user.budget (Users collection).
On each save, we recalc total cost of the chosen players and subtract from leftover.
If cost > leftover, the server rejects it.
Leaderboard
GET /api/leaderboard returns top users sorted by totalPoints.
The Leaderboard page displays them.
The logged-in user is highlighted (e.g., bold or different color).
API Routes

/api/players
GET: Return all players with on-the-fly derived stats (optional)
POST: Create a new player (raw stats)
PUT: Update a player’s raw stats
DELETE: Remove a player
/api/teams/[id]
GET: Return user’s existing team
POST: Save or update a user’s team (and leftover budget)
/api/leaderboard
GET: Return an array of users sorted by totalPoints
Authentication (Login/Signup)
Possibly POST /api/auth/signup
POST /api/auth/login
Technologies

Next.js 13 App Router
React (Client-Side components)
TypeScript for type definitions
Mongoose / MongoDB for data storage
Axios for HTTP requests
License

MIT License (or your choice).

Feel free to adapt or remove licensing text if your project is private or uses a different license.

Enjoy using Spirit11!
If you have any questions or issues, please open an Issue or submit a Pull Request