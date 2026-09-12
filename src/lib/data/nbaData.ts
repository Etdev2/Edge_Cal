export interface TeamData {
  id: number;
  externalId: number;
  abbreviation: string;
  city: string;
  name: string;
  fullName: string;
  conference: string;
  division: string;
  primaryColor: string;
  secondaryColor: string;
}

export const NBA_TEAMS: TeamData[] = [
  { id: 1, externalId: 1, abbreviation: "DEN", city: "Denver", name: "Nuggets", fullName: "Denver Nuggets", conference: "West", division: "Northwest", primaryColor: "#0E2240", secondaryColor: "#FEC524" },
  { id: 2, externalId: 2, abbreviation: "DAL", city: "Dallas", name: "Mavericks", fullName: "Dallas Mavericks", conference: "West", division: "Southwest", primaryColor: "#00538C", secondaryColor: "#002B5E" },
  { id: 3, externalId: 3, abbreviation: "OKC", city: "Oklahoma City", name: "Thunder", fullName: "Oklahoma City Thunder", conference: "West", division: "Northwest", primaryColor: "#007AC1", secondaryColor: "#EF3B24" },
  { id: 4, externalId: 4, abbreviation: "BOS", city: "Boston", name: "Celtics", fullName: "Boston Celtics", conference: "East", division: "Atlantic", primaryColor: "#007A33", secondaryColor: "#BA9653" },
  { id: 5, externalId: 5, abbreviation: "MIL", city: "Milwaukee", name: "Bucks", fullName: "Milwaukee Bucks", conference: "East", division: "Central", primaryColor: "#00471B", secondaryColor: "#EEE1C6" },
  { id: 6, externalId: 6, abbreviation: "GSW", city: "Golden State", name: "Warriors", fullName: "Golden State Warriors", conference: "West", division: "Pacific", primaryColor: "#1D428A", secondaryColor: "#FFC72C" },
  { id: 7, externalId: 7, abbreviation: "LAL", city: "Los Angeles", name: "Lakers", fullName: "Los Angeles Lakers", conference: "West", division: "Pacific", primaryColor: "#552583", secondaryColor: "#FDB927" },
  { id: 8, externalId: 8, abbreviation: "MIN", city: "Minnesota", name: "Timberwolves", fullName: "Minnesota Timberwolves", conference: "West", division: "Northwest", primaryColor: "#0C2340", secondaryColor: "#236192" },
  { id: 9, externalId: 9, abbreviation: "SAS", city: "San Antonio", name: "Spurs", fullName: "San Antonio Spurs", conference: "West", division: "Southwest", primaryColor: "#C4CED4", secondaryColor: "#000000" },
  { id: 10, externalId: 10, abbreviation: "NYK", city: "New York", name: "Knicks", fullName: "New York Knicks", conference: "East", division: "Atlantic", primaryColor: "#006BB6", secondaryColor: "#F58426" },
  { id: 11, externalId: 11, abbreviation: "PHX", city: "Phoenix", name: "Suns", fullName: "Phoenix Suns", conference: "West", division: "Pacific", primaryColor: "#1D1160", secondaryColor: "#E56020" },
  { id: 12, externalId: 12, abbreviation: "IND", city: "Indiana", name: "Pacers", fullName: "Indiana Pacers", conference: "East", division: "Central", primaryColor: "#002D62", secondaryColor: "#FDBB30" },
  { id: 13, externalId: 13, abbreviation: "PHI", city: "Philadelphia", name: "76ers", fullName: "Philadelphia 76ers", conference: "East", division: "Atlantic", primaryColor: "#006BB6", secondaryColor: "#ED174C" },
  { id: 14, externalId: 14, abbreviation: "MIA", city: "Miami", name: "Heat", fullName: "Miami Heat", conference: "East", division: "Southeast", primaryColor: "#98002E", secondaryColor: "#F9A01B" },
  { id: 15, externalId: 15, abbreviation: "CLE", city: "Cleveland", name: "Cavaliers", fullName: "Cleveland Cavaliers", conference: "East", division: "Central", primaryColor: "#860038", secondaryColor: "#041E42" },
  { id: 16, externalId: 16, abbreviation: "SAC", city: "Sacramento", name: "Kings", fullName: "Sacramento Kings", conference: "West", division: "Pacific", primaryColor: "#5A2D81", secondaryColor: "#63727A" },
  { id: 17, externalId: 17, abbreviation: "ORL", city: "Orlando", name: "Magic", fullName: "Orlando Magic", conference: "East", division: "Southeast", primaryColor: "#0077C0", secondaryColor: "#C4CED4" },
  { id: 18, externalId: 18, abbreviation: "LAC", city: "LA", name: "Clippers", fullName: "LA Clippers", conference: "West", division: "Pacific", primaryColor: "#C8102E", secondaryColor: "#1D428A" },
  { id: 19, externalId: 19, abbreviation: "NOP", city: "New Orleans", name: "Pelicans", fullName: "New Orleans Pelicans", conference: "West", division: "Southwest", primaryColor: "#0C2340", secondaryColor: "#C8102E" },
  { id: 20, externalId: 20, abbreviation: "HOU", city: "Houston", name: "Rockets", fullName: "Houston Rockets", conference: "West", division: "Southwest", primaryColor: "#CE1141", secondaryColor: "#000000" },
  { id: 21, externalId: 21, abbreviation: "ATL", city: "Atlanta", name: "Hawks", fullName: "Atlanta Hawks", conference: "East", division: "Southeast", primaryColor: "#E03A3E", secondaryColor: "#C1D32F" },
  { id: 22, externalId: 22, abbreviation: "CHI", city: "Chicago", name: "Bulls", fullName: "Chicago Bulls", conference: "East", division: "Central", primaryColor: "#CE1141", secondaryColor: "#000000" },
  { id: 23, externalId: 23, abbreviation: "TOR", city: "Toronto", name: "Raptors", fullName: "Toronto Raptors", conference: "East", division: "Atlantic", primaryColor: "#CE1141", secondaryColor: "#000000" },
  { id: 24, externalId: 24, abbreviation: "MEM", city: "Memphis", name: "Grizzlies", fullName: "Memphis Grizzlies", conference: "West", division: "Southwest", primaryColor: "#5D76A9", secondaryColor: "#12173F" },
  { id: 25, externalId: 25, abbreviation: "BKN", city: "Brooklyn", name: "Nets", fullName: "Brooklyn Nets", conference: "East", division: "Atlantic", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: 26, externalId: 26, abbreviation: "UTA", city: "Utah", name: "Jazz", fullName: "Utah Jazz", conference: "West", division: "Northwest", primaryColor: "#002B5C", secondaryColor: "#00471B" },
  { id: 27, externalId: 27, abbreviation: "POR", city: "Portland", name: "Trail Blazers", fullName: "Portland Trail Blazers", conference: "West", division: "Northwest", primaryColor: "#E03A3E", secondaryColor: "#000000" },
  { id: 28, externalId: 28, abbreviation: "DET", city: "Detroit", name: "Pistons", fullName: "Detroit Pistons", conference: "East", division: "Central", primaryColor: "#1D42BA", secondaryColor: "#BEC0C2" },
  { id: 29, externalId: 29, abbreviation: "CHA", city: "Charlotte", name: "Hornets", fullName: "Charlotte Hornets", conference: "East", division: "Southeast", primaryColor: "#1D1160", secondaryColor: "#00788C" },
  { id: 30, externalId: 30, abbreviation: "WAS", city: "Washington", name: "Wizards", fullName: "Washington Wizards", conference: "East", division: "Southeast", primaryColor: "#002B5C", secondaryColor: "#E31837" },
];

export interface PlayerSeed {
  id: number;
  externalId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  jerseyNumber: string;
  teamAbbr: string;
  teamId: number;
  height: string;
  weight: string;
  avatarUrl: string;
  typicalAverages: {
    pts: number;
    reb: number;
    ast: number;
    fg3m: number;
    blk: number;
    stl: number;
  };
}

export const NBA_PLAYERS: PlayerSeed[] = [
  {
    id: 1,
    externalId: 246,
    firstName: "Nikola",
    lastName: "Jokić",
    fullName: "Nikola Jokić",
    position: "C",
    jerseyNumber: "15",
    teamAbbr: "DEN",
    teamId: 1,
    height: "6-11",
    weight: "284",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 26.4, reb: 12.4, ast: 9.0, fg3m: 1.1, blk: 0.9, stl: 1.4 },
  },
  {
    id: 2,
    externalId: 132,
    firstName: "Luka",
    lastName: "Dončić",
    fullName: "Luka Dončić",
    position: "G-F",
    jerseyNumber: "77",
    teamAbbr: "DAL",
    teamId: 2,
    height: "6-7",
    weight: "230",
    avatarUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 33.9, reb: 9.2, ast: 9.8, fg3m: 3.8, blk: 0.5, stl: 1.4 },
  },
  {
    id: 3,
    externalId: 419,
    firstName: "Shai",
    lastName: "Gilgeous-Alexander",
    fullName: "Shai Gilgeous-Alexander",
    position: "G",
    jerseyNumber: "2",
    teamAbbr: "OKC",
    teamId: 3,
    height: "6-6",
    weight: "195",
    avatarUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 30.1, reb: 5.5, ast: 6.2, fg3m: 1.3, blk: 0.9, stl: 2.0 },
  },
  {
    id: 4,
    externalId: 15,
    firstName: "Giannis",
    lastName: "Antetokounmpo",
    fullName: "Giannis Antetokounmpo",
    position: "F",
    jerseyNumber: "34",
    teamAbbr: "MIL",
    teamId: 5,
    height: "6-11",
    weight: "243",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 30.4, reb: 11.5, ast: 6.5, fg3m: 0.5, blk: 1.1, stl: 1.2 },
  },
  {
    id: 5,
    externalId: 115,
    firstName: "Stephen",
    lastName: "Curry",
    fullName: "Stephen Curry",
    position: "G",
    jerseyNumber: "30",
    teamAbbr: "GSW",
    teamId: 6,
    height: "6-2",
    weight: "185",
    avatarUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 26.4, reb: 4.5, ast: 5.1, fg3m: 4.8, blk: 0.4, stl: 0.7 },
  },
  {
    id: 6,
    externalId: 237,
    firstName: "LeBron",
    lastName: "James",
    fullName: "LeBron James",
    position: "F",
    jerseyNumber: "23",
    teamAbbr: "LAL",
    teamId: 7,
    height: "6-9",
    weight: "250",
    avatarUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 25.7, reb: 7.3, ast: 8.3, fg3m: 2.1, blk: 0.5, stl: 1.2 },
  },
  {
    id: 7,
    externalId: 434,
    firstName: "Jayson",
    lastName: "Tatum",
    fullName: "Jayson Tatum",
    position: "F-G",
    jerseyNumber: "0",
    teamAbbr: "BOS",
    teamId: 4,
    height: "6-8",
    weight: "210",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 26.9, reb: 8.1, ast: 4.9, fg3m: 3.1, blk: 0.6, stl: 1.0 },
  },
  {
    id: 8,
    externalId: 354,
    firstName: "Anthony",
    lastName: "Edwards",
    fullName: "Anthony Edwards",
    position: "G",
    jerseyNumber: "5",
    teamAbbr: "MIN",
    teamId: 8,
    height: "6-4",
    weight: "225",
    avatarUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 25.9, reb: 5.4, ast: 5.1, fg3m: 2.4, blk: 0.5, stl: 1.3 },
  },
  {
    id: 9,
    externalId: 999,
    firstName: "Victor",
    lastName: "Wembanyama",
    fullName: "Victor Wembanyama",
    position: "C-F",
    jerseyNumber: "1",
    teamAbbr: "SAS",
    teamId: 9,
    height: "7-4",
    weight: "210",
    avatarUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 21.4, reb: 10.6, ast: 3.9, fg3m: 1.8, blk: 3.6, stl: 1.2 },
  },
  {
    id: 10,
    externalId: 140,
    firstName: "Kevin",
    lastName: "Durant",
    fullName: "Kevin Durant",
    position: "F",
    jerseyNumber: "35",
    teamAbbr: "PHX",
    teamId: 11,
    height: "6-11",
    weight: "240",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 27.1, reb: 6.6, ast: 5.0, fg3m: 2.2, blk: 1.2, stl: 0.9 },
  },
  {
    id: 11,
    externalId: 66,
    firstName: "Jalen",
    lastName: "Brunson",
    fullName: "Jalen Brunson",
    position: "G",
    jerseyNumber: "11",
    teamAbbr: "NYK",
    teamId: 10,
    height: "6-2",
    weight: "190",
    avatarUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 28.7, reb: 3.6, ast: 6.7, fg3m: 2.7, blk: 0.2, stl: 0.9 },
  },
  {
    id: 12,
    externalId: 212,
    firstName: "Tyrese",
    lastName: "Haliburton",
    fullName: "Tyrese Haliburton",
    position: "G",
    jerseyNumber: "0",
    teamAbbr: "IND",
    teamId: 12,
    height: "6-5",
    weight: "185",
    avatarUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { pts: 20.1, reb: 3.9, ast: 10.9, fg3m: 2.8, blk: 0.7, stl: 1.2 },
  },
];
