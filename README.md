# 1st Response

# Mathematical Formulas in VoteChain

## 1. Vote Percentage Calculation

**Title:** Vote Percentage Calculation  
**Description:** Calculates the percentage of votes a candidate received out of total votes  
**Formula:** `(candidate.votes / totalVotes) * 100`

**Implementation:**
```javascript
const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
```

**Example:**
- If a candidate has 25 votes and total votes are 100
- Percentage = (25 / 100) * 100 = 25%
- This is displayed with one decimal place: "25.0%"

## 2. Turnout Rate Calculation

**Title:** Voter Turnout Rate  
**Description:** Calculates the percentage of eligible voters who cast a vote  
**Formula:** `(totalVotes / election.participants) * 100`

**Implementation:**
```javascript
const turnoutRate = election.participants > 0 ? (totalVotes / election.participants) * 100 : 0
```

**Example:**
- If 75 people voted out of 200 eligible participants
- Turnout Rate = (75 / 200) * 100 = 37.5%
- This is displayed with one decimal place: "37.5%"

## 3. Total Votes Calculation

**Title:** Total Votes Aggregation  
**Description:** Calculates the sum of all votes across all candidates in an election  
**Formula:** `sum(candidate.votes for each candidate)`

**Implementation:**
```javascript
const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
```

**Example:**
- If candidates have 10, 15, and 20 votes respectively
- Total Votes = 10 + 15 + 20 = 45 votes

## 4. Election Progress Percentage

**Title:** Election Progress Percentage  
**Description:** Calculates how far an election has progressed in its timeline  
**Formula:** `((currentTime - startTime) / (endTime - startTime)) * 100`

**Implementation:**
```javascript
// This is implied in the code where progressPercentage is used
// The exact calculation isn't shown but the value is used here:
<div className="h-full bg-blue-600 transition-all" style={{ width: `${progressPercentage}%` }} />
```

**Example:**
- If an election started 2 days ago, ends in 1 day (total duration 3 days)
- Progress = ((2) / (3)) * 100 = 66.7%

## 5. Winner Determination Algorithm

**Title:** Election Winner Determination  
**Description:** Algorithm to determine the winner of an election based on vote count  
**Formula:** Find candidate with maximum votes, check for ties

**Implementation:**
```solidity
uint256 maxVotes = 0;
uint256 winnerIndex = 0;
bool hasTie = false;

for (uint256 i = 0; i < candidatesLength; ) {
    uint256 currentVotes = elections[_electionId].candidates[i].voteCount;
    
    if (currentVotes > maxVotes) {
        maxVotes = currentVotes;
        winnerIndex = i;
        hasTie = false;
    } else if (currentVotes == maxVotes && maxVotes > 0) {
        hasTie = true;
    }
    
    unchecked { ++i; }
}

string memory winnerName = hasTie
    ? "TIE - Multiple Winners"
    : elections[_electionId].candidates[winnerIndex].name;
```

**Example:**
- If candidates have votes: [10, 25, 15]
- maxVotes becomes 25, winnerIndex is 1
- Winner is the candidate at index 1

## 6. Candidate Ranking

**Title:** Candidate Ranking  
**Description:** Sorts candidates by vote count to determine their rank  
**Formula:** Sort candidates array by votes in descending order, then find index + 1

**Implementation:**
```javascript
const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes)

// Used for ranking in UI:
rank={isElectionEnded ? 
  election.candidates.sort((a, b) => b.votes - a.votes).findIndex(c => c.id === candidate.id) + 1 
  : null}
```

**Example:**
- If candidates have votes: [10, 25, 15]
- Sorted order: [25, 15, 10]
- Candidate with 25 votes is rank 1, 15 votes is rank 2, etc.

## 7. Active Elections Calculation

**Title:** Active Elections Count  
**Description:** Counts the number of elections that haven't reached their deadline  
**Formula:** Count elections where deadline > current time

**Implementation:**
```javascript
const now = Math.floor(Date.now() / 1000)
const activeElections = elections.filter((e) => Number(e.deadline) > now).length
```

**Example:**
- If current timestamp is 1625000000
- Elections with deadlines [1624000000, 1626000000, 1627000000]
- Active elections = 2 (the ones with deadlines > current time)

## 8. Vote Incrementing

**Title:** Vote Counter Increment  
**Description:** Increments vote count for a candidate and total votes when a vote is cast  
**Formula:** `candidate.voteCount++` and `election.totalVotes++`

**Implementation:**
```solidity
function vote(uint256 _electionId, uint256 _candidateId) public {
    // ... validation ...
    uint256 index = _candidateId - 1;
    elections[_electionId].candidates[index].voteCount++;
    elections[_electionId].totalVotes++;
    // ... emit event ...
}
```

**Example:**
- If candidate had 10 votes, after voting they have 11
- If election had 45 total votes, after voting it has 46

These are all the mathematical formulas and implementations found in the VoteChain codebase, covering vote calculations, percentages, rankings, and election statistics.


# 2st Response


# Mathematical Formulas in VoteChain (Complete List)

## 1. Vote Percentage Calculation

**Title:** Vote Percentage Calculation  
**Description:** Calculates the percentage of votes a candidate received out of total votes  
**Formula:** `(candidate.votes / totalVotes) * 100`

**Implementation:**
```javascript
const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
```

**Example:**
- If a candidate has 25 votes and total votes are 100
- Percentage = (25 / 100) * 100 = 25%
- This is displayed with one decimal place: "25.0%"

## 2. Turnout Rate Calculation

**Title:** Voter Turnout Rate  
**Description:** Calculates the percentage of eligible voters who cast a vote  
**Formula:** `(totalVotes / election.participants) * 100`

**Implementation:**
```javascript
const turnoutRate = election.participants > 0 ? (totalVotes / election.participants) * 100 : 0
```

**Example:**
- If 75 people voted out of 200 eligible participants
- Turnout Rate = (75 / 200) * 100 = 37.5%
- This is displayed with one decimal place: "37.5%"

## 3. Total Votes Calculation

**Title:** Total Votes Aggregation  
**Description:** Calculates the sum of all votes across all candidates in an election  
**Formula:** `sum(candidate.votes for each candidate)`

**Implementation:**
```javascript
const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
```

**Example:**
- If candidates have 10, 15, and 20 votes respectively
- Total Votes = 10 + 15 + 20 = 45 votes

## 4. Election Progress Percentage

**Title:** Election Progress Percentage  
**Description:** Calculates how far an election has progressed in its timeline  
**Formula:** `(elapsed / totalDuration) * 100`

**Implementation:**
```javascript
const totalDuration = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
const elapsed = now - (deadline - totalDuration)
const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100)
```

**Example:**
- If an election started 10 days ago and has a total duration of 14 days
- Progress = (10 / 14) * 100 = 71.4%
- This is capped at 100% using Math.min

## 5. Winner Determination Algorithm

**Title:** Election Winner Determination  
**Description:** Algorithm to determine the winner of an election based on vote count  
**Formula:** Find candidate with maximum votes, check for ties

**Implementation:**
```solidity
uint256 maxVotes = 0;
uint256 winnerIndex = 0;
bool hasTie = false;

for (uint256 i = 0; i < candidatesLength; ) {
    uint256 currentVotes = elections[_electionId].candidates[i].voteCount;
    
    if (currentVotes > maxVotes) {
        maxVotes = currentVotes;
        winnerIndex = i;
        hasTie = false;
    } else if (currentVotes == maxVotes && maxVotes > 0) {
        hasTie = true;
    }
    
    unchecked { ++i; }
}

string memory winnerName = hasTie
    ? "TIE - Multiple Winners"
    : elections[_electionId].candidates[winnerIndex].name;
```

**Example:**
- If candidates have votes: [10, 25, 15]
- maxVotes becomes 25, winnerIndex is 1
- Winner is the candidate at index 1

## 6. Candidate Ranking

**Title:** Candidate Ranking  
**Description:** Sorts candidates by vote count to determine their rank  
**Formula:** Sort candidates array by votes in descending order, then find index + 1

**Implementation:**
```javascript
const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes)

// Used for ranking in UI:
rank={isElectionEnded ? 
  election.candidates.sort((a, b) => b.votes - a.votes).findIndex(c => c.id === candidate.id) + 1 
  : null}
```

**Example:**
- If candidates have votes: [10, 25, 15]
- Sorted order: [25, 15, 10]
- Candidate with 25 votes is rank 1, 15 votes is rank 2, etc.

## 7. Active Elections Calculation

**Title:** Active Elections Count  
**Description:** Counts the number of elections that haven't reached their deadline  
**Formula:** Count elections where deadline > current time

**Implementation:**
```javascript
const now = Math.floor(Date.now() / 1000)
const activeElections = elections.filter((e) => Number(e.deadline) > now).length
```

**Example:**
- If current timestamp is 1625000000
- Elections with deadlines [1624000000, 1626000000, 1627000000]
- Active elections = 2 (the ones with deadlines > current time)

## 8. Vote Incrementing

**Title:** Vote Counter Increment  
**Description:** Increments vote count for a candidate and total votes when a vote is cast  
**Formula:** `candidate.voteCount++` and `election.totalVotes++`

**Implementation:**
```solidity
function vote(uint256 _electionId, uint256 _candidateId) public {
    // ... validation ...
    uint256 index = _candidateId - 1;
    elections[_electionId].candidates[index].voteCount++;
    elections[_electionId].totalVotes++;
    // ... emit event ...
}
```

**Example:**
- If candidate had 10 votes, after voting they have 11
- If election had 45 total votes, after voting it has 46

## 9. Time Remaining Calculation

**Title:** Time Remaining Calculation  
**Description:** Calculates the time remaining until an election's deadline  
**Formula:** Convert time difference to days, hours, minutes, and seconds

**Implementation:**
```javascript
getTimeRemaining: (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = Number(deadline) - now;

    if (timeRemaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }

    const days = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(timeRemaining % 60);

    return { days, hours, minutes, seconds, isEnded: false };
}
```

**Example:**
- If deadline is 172,800 seconds from now (2 days)
- Time remaining: 2 days, 0 hours, 0 minutes, 0 seconds

## 10. Countdown Timer Calculation

**Title:** Countdown Timer  
**Description:** Calculates and formats time remaining for display in election cards  
**Formula:** Convert millisecond difference to days, hours, minutes

**Implementation:**
```javascript
const now = new Date().getTime()
const deadline = new Date(election.deadline).getTime()
const difference = deadline - now

if (difference > 0) {
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    setTimeLeft(`${days}d ${hours}h`)
  } else if (hours > 0) {
    setTimeLeft(`${hours}h ${minutes}m`)
  } else {
    setTimeLeft(`${minutes}m`)
  }
  setIsElectionEnded(false)
} else {
  setTimeLeft("Ended")
  setIsElectionEnded(true)
}
```

**Example:**
- If difference is 172,800,000 ms (2 days)
- Display: "2d 0h"
- If difference is 3,600,000 ms (1 hour)
- Display: "1h 0m"

## 11. Minimum Bar Width Calculation

**Title:** Minimum Bar Width for Visualization  
**Description:** Ensures bar charts have a minimum visible width even for very small percentages  
**Formula:** `Math.max(percentage, 5)`

**Implementation:**
```javascript
style={{ width: `${Math.max(percentage, 5)}%` }}
```

**Example:**
- If percentage is 2%, bar width will be 5%
- If percentage is 20%, bar width will be 20%

## 12. Election Duration Validation

**Title:** Election Duration Validation  
**Description:** Validates that election duration is within allowed limits  
**Formula:** Check if duration is between minimum and maximum allowed days

**Implementation:**
```solidity
require(
    _deadline >= MINIMUM_DURATION_DAYS &&
        _deadline <= MAXIMUM_DURATION_DAYS,
    "Duration must be between 1 and 7 days"
);
```

**Example:**
- If MINIMUM_DURATION_DAYS is 1 and MAXIMUM_DURATION_DAYS is 7
- A duration of 0 days would fail
- A duration of 8 days would fail
- A duration of 3 days would pass

These are all the mathematical formulas and implementations found in the VoteChain codebase, covering vote calculations, percentages, rankings, time calculations, and election statistics.


# 3rd response

# Additional Mathematical Implementations in VoteChain

## 1. GraphQL Query Pagination Algorithm

**Title:** GraphQL Query Pagination  
**Description:** Algorithm for paginated data fetching with offset-based pagination  
**Formula:** `first: limit, skip: offset`

**Implementation:**
```javascript
const GET_ELECTIONS = gql`
  query GetElections($first: Int) {
    electionCreateds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      internal_id
      creator
      name
      description
      image
      deadline
      blockTimestamp
    }
  }
`;
```

**Complexity:** O(n) where n is the number of items requested

## 2. Blockchain Timestamp Conversion

**Title:** Blockchain Timestamp Conversion  
**Description:** Converts blockchain timestamps (Unix seconds) to JavaScript Date objects (milliseconds)  
**Formula:** `javascriptTimestamp = blockchainTimestamp * 1000`

**Implementation:**
```javascript
formatTimestamp: (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
}
```

**Complexity:** O(1)

## 3. Smart Contract Gas Optimization with Unchecked Math

**Title:** Gas-Optimized Loop Incrementing  
**Description:** Uses Solidity's unchecked block to save gas by skipping overflow checks  
**Formula:** `unchecked { ++i; }`

**Implementation:**
```solidity
for (uint256 i = 0; i < candidatesLength; ) {
    // Loop body
    unchecked { ++i; }
}
```

**Complexity:** Reduces gas cost by ~30-40 gas per iteration

## 4. String Uniqueness Verification using Keccak256

**Title:** String Uniqueness Verification  
**Description:** Uses cryptographic hashing to verify candidate names are unique  
**Formula:** `keccak256(bytes(string1)) != keccak256(bytes(string2))`

**Implementation:**
```solidity
for (uint256 i = 0; i < _candidates_name.length; i++) {
    for (uint256 j = i + 1; j < _candidates_name.length; j++) {
        require(
            keccak256(bytes(_candidates_name[i])) != keccak256(bytes(_candidates_name[j])),
            "Duplicate candidate names not allowed"
        );
    }
}
```

**Complexity:** O(n²) where n is the number of candidates

## 5. Dynamic Bar Color Assignment Algorithm

**Title:** Dynamic Bar Color Assignment  
**Description:** Assigns different gradient colors based on candidate ranking  
**Formula:** Array-based mapping of index to color gradient

**Implementation:**
```javascript
const barColors = [
  "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-yellow-500/50", // Winner - Gold
  "bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/50", // Second - Silver
  "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-500/50", // Third - Bronze
  "bg-gradient-to-r from-gray-400 to-gray-600 shadow-gray-500/50", // Others - Blue
];

// Usage
className={`h-full ${barColors[index] || barColors[3]} transition-all duration-1000 ease-out`}
```

**Complexity:** O(1) lookup time

## 6. Conditional UI Rendering Based on Vote Threshold

**Title:** Conditional UI Rendering Based on Vote Threshold  
**Description:** Only renders percentage labels when the percentage exceeds a visibility threshold  
**Formula:** `if percentage > threshold then render`

**Implementation:**
```javascript
{percentage > 15 && (
  <span className="text-white font-semibold">{percentage.toFixed(1)}%</span>
)}
```

**Complexity:** O(1)

## 7. Deadline Calculation with Day Conversion

**Title:** Deadline Calculation with Day Conversion  
**Description:** Converts days to seconds for blockchain storage  
**Formula:** `deadline = block.timestamp + (_deadline * 1 days)`

**Implementation:**
```solidity
uint256 deadline = block.timestamp + (_deadline * 1 days);
```

**Complexity:** O(1)

# 4th response:


## 1. Candidate Vote Count Aggregation

**Title:** Candidate Vote Count Aggregation  
**Description:** Calculates the number of votes per candidate by counting vote events  
**Formula:** Count votes where vote.candidateId === candidate.candidateId

**Implementation:**
```javascript
const candidatesWithVotes = candidates.map(candidate => {
    const candidateVotes = votes.filter(vote => vote.candidateId === candidate.candidateId);
    return {
        ...candidate,
        voteCount: candidateVotes.length.toString()
    };
});
```

**Complexity:** O(n×m) where n is number of candidates and m is number of votes

## 2. Search Filtering Algorithm

**Title:** Election Search Filtering  
**Description:** Filters elections based on search query and category  
**Formula:** Compound filter with text search and timestamp comparison

**Implementation:**
```javascript
let filtered = [...elections]

if (searchQuery) {
  filtered = filtered.filter(
    (election) =>
      election.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      election.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )
}

const now = Math.floor(Date.now() / 1000)

if (selectedCategory !== "all") {
  if (selectedCategory === "active") {
    filtered = filtered.filter((election) => Number(election.deadline) > now)
  } else if (selectedCategory === "ended") {
    filtered = filtered.filter((election) => Number(election.deadline) <= now)
  }
}
```

**Complexity:** O(n) where n is number of elections

## 3. GraphQL Pagination and Sorting

**Title:** GraphQL Query Pagination and Sorting  
**Description:** Uses GraphQL parameters to paginate and sort query results  
**Formula:** `first: limit, orderBy: field, orderDirection: direction`

**Implementation:**
```javascript
const GET_RECENT_VOTES = gql`
  query GetRecentVotes($electionId: BigInt!, $first: Int) {
    voteSubmitteds(
      where: { electionId: $electionId }
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      voter_address
      candidateId
      blockTimestamp
    }
  }
`;

// Usage
fetchRecentVotes: async (electionId, limit = 10) => {
    const data = await request(GRAPH_API_URL, GET_RECENT_VOTES, {
        electionId: electionId,
        first: limit
    });
}
```

**Complexity:** O(1) for query construction, underlying database complexity depends on implementation

## 4. Dynamic Color Assignment Based on Index

**Title:** Dynamic Color Assignment  
**Description:** Assigns colors to candidate indicators based on their ranking  
**Formula:** Ternary operator chain based on index value

**Implementation:**
```javascript
<div className={`w-3 h-3 rounded-full ${
    index === 0 ? "bg-blue-500" :
    index === 1 ? "bg-purple-500" :
    index === 2 ? "bg-green-500" :
    "bg-gray-400"
}`}></div>
```

**Complexity:** O(1)

These additional mathematical implementations complement the ones previously identified, providing a more complete picture of the mathematical operations in the VoteChain codebase.