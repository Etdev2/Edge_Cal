/**
 * NFL seed data (2026 season) — 32 teams + 12 featured star players with
 * realistic per-game averages. ID ranges are deliberately disjoint from the
 * NBA seed (teams 31–62 / external 101–132, players 13–24 / external 2001+)
 * so the two leagues never collide in the shared tables.
 *
 * Like the NBA seed this is a deterministic, clearly-labeled demo dataset:
 * it exercises the exact same evidence pipeline (DNP exclusion, low-activity
 * flag, overtime, push settlement, all 7 evidence windows).
 */
import type { TeamData } from "./nbaData";

export const NFL_TEAMS: TeamData[] = [
  // AFC East
  { id: 31, externalId: 101, abbreviation: "BUF", city: "Buffalo", name: "Bills", fullName: "Buffalo Bills", conference: "AFC", division: "East", primaryColor: "#00338D", secondaryColor: "#C60C30" },
  { id: 32, externalId: 102, abbreviation: "MIA", city: "Miami", name: "Dolphins", fullName: "Miami Dolphins", conference: "AFC", division: "East", primaryColor: "#008E97", secondaryColor: "#FC4C02" },
  { id: 33, externalId: 103, abbreviation: "NE", city: "New England", name: "Patriots", fullName: "New England Patriots", conference: "AFC", division: "East", primaryColor: "#002244", secondaryColor: "#D50A0A" },
  { id: 34, externalId: 104, abbreviation: "NYJ", city: "New York", name: "Jets", fullName: "New York Jets", conference: "AFC", division: "East", primaryColor: "#125740", secondaryColor: "#000000" },
  // AFC North
  { id: 35, externalId: 105, abbreviation: "BAL", city: "Baltimore", name: "Ravens", fullName: "Baltimore Ravens", conference: "AFC", division: "North", primaryColor: "#241773", secondaryColor: "#9E7C0C" },
  { id: 36, externalId: 106, abbreviation: "CIN", city: "Cincinnati", name: "Bengals", fullName: "Cincinnati Bengals", conference: "AFC", division: "North", primaryColor: "#FB4F14", secondaryColor: "#000000" },
  { id: 37, externalId: 107, abbreviation: "CLE", city: "Cleveland", name: "Browns", fullName: "Cleveland Browns", conference: "AFC", division: "North", primaryColor: "#311D00", secondaryColor: "#FF3C00" },
  { id: 38, externalId: 108, abbreviation: "PIT", city: "Pittsburgh", name: "Steelers", fullName: "Pittsburgh Steelers", conference: "AFC", division: "North", primaryColor: "#FFB612", secondaryColor: "#101820" },
  // AFC South
  { id: 39, externalId: 109, abbreviation: "HOU", city: "Houston", name: "Texans", fullName: "Houston Texans", conference: "AFC", division: "South", primaryColor: "#03202F", secondaryColor: "#A71930" },
  { id: 40, externalId: 110, abbreviation: "IND", city: "Indianapolis", name: "Colts", fullName: "Indianapolis Colts", conference: "AFC", division: "South", primaryColor: "#002C5F", secondaryColor: "#A2AAAD" },
  { id: 41, externalId: 111, abbreviation: "JAX", city: "Jacksonville", name: "Jaguars", fullName: "Jacksonville Jaguars", conference: "AFC", division: "South", primaryColor: "#006778", secondaryColor: "#D7A22A" },
  { id: 42, externalId: 112, abbreviation: "TEN", city: "Nashville", name: "Titans", fullName: "Tennessee Titans", conference: "AFC", division: "South", primaryColor: "#0C2340", secondaryColor: "#4B92DB" },
  // AFC West
  { id: 43, externalId: 113, abbreviation: "DEN", city: "Denver", name: "Broncos", fullName: "Denver Broncos", conference: "AFC", division: "West", primaryColor: "#FB4F14", secondaryColor: "#002244" },
  { id: 44, externalId: 114, abbreviation: "KC", city: "Kansas City", name: "Chiefs", fullName: "Kansas City Chiefs", conference: "AFC", division: "West", primaryColor: "#E31837", secondaryColor: "#FFB81C" },
  { id: 45, externalId: 115, abbreviation: "LAC", city: "Los Angeles", name: "Chargers", fullName: "Los Angeles Chargers", conference: "AFC", division: "West", primaryColor: "#00805C", secondaryColor: "#F58426" },
  { id: 46, externalId: 116, abbreviation: "LV", city: "Las Vegas", name: "Raiders", fullName: "Las Vegas Raiders", conference: "AFC", division: "West", primaryColor: "#000000", secondaryColor: "#A5ACAF" },
  // NFC East
  { id: 47, externalId: 117, abbreviation: "DAL", city: "Dallas", name: "Cowboys", fullName: "Dallas Cowboys", conference: "NFC", division: "East", primaryColor: "#041E42", secondaryColor: "#87959E" },
  { id: 48, externalId: 118, abbreviation: "NYG", city: "New York", name: "Giants", fullName: "New York Giants", conference: "NFC", division: "East", primaryColor: "#0B2265", secondaryColor: "#A71930" },
  { id: 49, externalId: 119, abbreviation: "PHI", city: "Philadelphia", name: "Eagles", fullName: "Philadelphia Eagles", conference: "NFC", division: "East", primaryColor: "#004C54", secondaryColor: "#A5ACAF" },
  { id: 50, externalId: 120, abbreviation: "WAS", city: "Washington", name: "Commanders", fullName: "Washington Commanders", conference: "NFC", division: "East", primaryColor: "#5A1414", secondaryColor: "#FFB612" },
  // NFC North
  { id: 51, externalId: 121, abbreviation: "CHI", city: "Chicago", name: "Bears", fullName: "Chicago Bears", conference: "NFC", division: "North", primaryColor: "#C83803", secondaryColor: "#0B162A" },
  { id: 52, externalId: 122, abbreviation: "DET", city: "Detroit", name: "Lions", fullName: "Detroit Lions", conference: "NFC", division: "North", primaryColor: "#0076B6", secondaryColor: "#B0B7BC" },
  { id: 53, externalId: 123, abbreviation: "GB", city: "Green Bay", name: "Packers", fullName: "Green Bay Packers", conference: "NFC", division: "North", primaryColor: "#203731", secondaryColor: "#FFB612" },
  { id: 54, externalId: 124, abbreviation: "MIN", city: "Minnesota", name: "Vikings", fullName: "Minnesota Vikings", conference: "NFC", division: "North", primaryColor: "#4F2683", secondaryColor: "#FFC62F" },
  // NFC South
  { id: 55, externalId: 125, abbreviation: "ATL", city: "Atlanta", name: "Falcons", fullName: "Atlanta Falcons", conference: "NFC", division: "South", primaryColor: "#A71930", secondaryColor: "#000000" },
  { id: 56, externalId: 126, abbreviation: "CAR", city: "Carolina", name: "Panthers", fullName: "Carolina Panthers", conference: "NFC", division: "South", primaryColor: "#0085CA", secondaryColor: "#A5ACAF" },
  { id: 57, externalId: 127, abbreviation: "NO", city: "New Orleans", name: "Saints", fullName: "New Orleans Saints", conference: "NFC", division: "South", primaryColor: "#D3BC8D", secondaryColor: "#333333" },
  { id: 58, externalId: 128, abbreviation: "TB", city: "Tampa Bay", name: "Buccaneers", fullName: "Tampa Bay Buccaneers", conference: "NFC", division: "South", primaryColor: "#D50A0A", secondaryColor: "#34302B" },
  // NFC West
  { id: 59, externalId: 129, abbreviation: "ARI", city: "Arizona", name: "Cardinals", fullName: "Arizona Cardinals", conference: "NFC", division: "West", primaryColor: "#97233F", secondaryColor: "#FFB612" },
  { id: 60, externalId: 130, abbreviation: "LAR", city: "Los Angeles", name: "Rams", fullName: "Los Angeles Rams", conference: "NFC", division: "West", primaryColor: "#003594", secondaryColor: "#FFA300" },
  { id: 61, externalId: 131, abbreviation: "SF", city: "San Francisco", name: "49ers", fullName: "San Francisco 49ers", conference: "NFC", division: "West", primaryColor: "#AA0000", secondaryColor: "#B3995D" },
  { id: 62, externalId: 132, abbreviation: "SEA", city: "Seattle", name: "Seahawks", fullName: "Seattle Seahawks", conference: "NFC", division: "West", primaryColor: "#002244", secondaryColor: "#69BE28" },
];

export interface NflPlayerAverages {
  passYds: number;
  passTd: number;
  passInt: number;
  rushYds: number;
  rushTd: number;
  rec: number;
  recYds: number;
  recTd: number;
}

export interface NflPlayerSeed {
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
  typicalAverages: NflPlayerAverages;
}

export const NFL_PLAYERS: NflPlayerSeed[] = [
  {
    id: 13,
    externalId: 2001,
    firstName: "Josh",
    lastName: "Allen",
    fullName: "Josh Allen",
    position: "QB",
    jerseyNumber: "17",
    teamAbbr: "BUF",
    teamId: 31,
    height: "6-4",
    weight: "237",
    avatarUrl: "https://images.unsplash.com/photo-1566577739112-568a3474d0e0?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 270, passTd: 2.2, passInt: 0.9, rushYds: 45, rushTd: 0.5, rec: 1.0, recYds: 10, recTd: 0.1 },
  },
  {
    id: 14,
    externalId: 2002,
    firstName: "Patrick",
    lastName: "Mahomes",
    fullName: "Patrick Mahomes",
    position: "QB",
    jerseyNumber: "15",
    teamAbbr: "KC",
    teamId: 44,
    height: "6-2",
    weight: "210",
    avatarUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 280, passTd: 2.4, passInt: 1.0, rushYds: 18, rushTd: 0.2, rec: 0.5, recYds: 6, recTd: 0.0 },
  },
  {
    id: 15,
    externalId: 2003,
    firstName: "Lamar",
    lastName: "Jackson",
    fullName: "Lamar Jackson",
    position: "QB",
    jerseyNumber: "8",
    teamAbbr: "BAL",
    teamId: 35,
    height: "6-0",
    weight: "222",
    avatarUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 215, passTd: 1.9, passInt: 0.8, rushYds: 65, rushTd: 0.7, rec: 0.3, recYds: 4, recTd: 0.0 },
  },
  {
    id: 16,
    externalId: 2004,
    firstName: "Justin",
    lastName: "Herbert",
    fullName: "Justin Herbert",
    position: "QB",
    jerseyNumber: "10",
    teamAbbr: "LAC",
    teamId: 45,
    height: "6-5",
    weight: "230",
    avatarUrl: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 265, passTd: 2.1, passInt: 0.8, rushYds: 12, rushTd: 0.1, rec: 0.4, recYds: 5, recTd: 0.0 },
  },
  {
    id: 17,
    externalId: 2005,
    firstName: "Christian",
    lastName: "McCaffrey",
    fullName: "Christian McCaffrey",
    position: "RB",
    jerseyNumber: "23",
    teamAbbr: "SF",
    teamId: 61,
    height: "5-11",
    weight: "210",
    avatarUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 75, rushTd: 0.6, rec: 5.5, recYds: 45, recTd: 0.3 },
  },
  {
    id: 18,
    externalId: 2006,
    firstName: "Bijan",
    lastName: "Robinson",
    fullName: "Bijan Robinson",
    position: "RB",
    jerseyNumber: "6",
    teamAbbr: "ATL",
    teamId: 55,
    height: "5-10",
    weight: "212",
    avatarUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 78, rushTd: 0.7, rec: 5.0, recYds: 40, recTd: 0.2 },
  },
  {
    id: 19,
    externalId: 2007,
    firstName: "Nick",
    lastName: "Chubb",
    fullName: "Nick Chubb",
    position: "RB",
    jerseyNumber: "29",
    teamAbbr: "CLE",
    teamId: 37,
    height: "5-11",
    weight: "238",
    avatarUrl: "https://images.unsplash.com/photo-1531565637446-32f05b5d9d0b?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 68, rushTd: 0.5, rec: 4.0, recYds: 30, recTd: 0.2 },
  },
  {
    id: 20,
    externalId: 2008,
    firstName: "Jahmyr",
    lastName: "Gibbs",
    fullName: "Jahmyr Gibbs",
    position: "RB",
    jerseyNumber: "4",
    teamAbbr: "DET",
    teamId: 52,
    height: "5-9",
    weight: "208",
    avatarUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 55, rushTd: 0.4, rec: 5.0, recYds: 38, recTd: 0.3 },
  },
  {
    id: 21,
    externalId: 2009,
    firstName: "Ja'Marr",
    lastName: "Chase",
    fullName: "Ja'Marr Chase",
    position: "WR",
    jerseyNumber: "1",
    teamAbbr: "CIN",
    teamId: 36,
    height: "6-3",
    weight: "207",
    avatarUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 5, rushTd: 0.1, rec: 7.5, recYds: 105, recTd: 0.7 },
  },
  {
    id: 22,
    externalId: 2010,
    firstName: "Tyreek",
    lastName: "Hill",
    fullName: "Tyreek Hill",
    position: "WR",
    jerseyNumber: "10",
    teamAbbr: "MIA",
    teamId: 32,
    height: "5-11",
    weight: "190",
    avatarUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 4, rushTd: 0.1, rec: 7.0, recYds: 92, recTd: 0.5 },
  },
  {
    id: 23,
    externalId: 2011,
    firstName: "Amon-Ra",
    lastName: "St. Brown",
    fullName: "Amon-Ra St. Brown",
    position: "WR",
    jerseyNumber: "14",
    teamAbbr: "DET",
    teamId: 52,
    height: "6-3",
    weight: "218",
    avatarUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 3, rushTd: 0.0, rec: 8.0, recYds: 108, recTd: 0.8 },
  },
  {
    id: 24,
    externalId: 2012,
    firstName: "Puka",
    lastName: "Nacua",
    fullName: "Puka Nacua",
    position: "WR",
    jerseyNumber: "12",
    teamAbbr: "LAR",
    teamId: 60,
    height: "6-3",
    weight: "211",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160&auto=format&fit=crop&q=80",
    typicalAverages: { passYds: 0, passTd: 0, passInt: 0, rushYds: 2, rushTd: 0.0, rec: 8.5, recYds: 112, recTd: 0.9 },
  },
];
