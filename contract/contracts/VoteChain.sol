// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VoteChain
 * @dev A decentralized Voting Platform
 * @author Shangesh
 */
contract VoteChain is Ownable, Pausable {
    uint256 public totalElection = 0;
    uint256 public constant MINIMUM_DURATION_DAYS = 1;
    uint256 public constant MAXIMUM_DURATION_DAYS = 7;
    uint256 public constant MIN_CANDIDATES = 2;
    uint256 public constant MAX_CANDIDATES = 10;
    uint256[] public allElectionIds;

    struct CandidateStruct {
        uint256 candidateId;
        string name;
        string description;
        uint256 voteCount;
    }

    struct ElectionStruct {
        uint256 id;
        address creator;
        string name;
        string description;
        string image;
        CandidateStruct[] candidates;
        uint256 deadline;
        mapping(address => bool) hasVoted;
        uint256 totalVotes;
        string winner;
    }

    mapping(uint256 => ElectionStruct) private elections;

    event ElectionCreated(
        uint256 id,
        address indexed creator,
        string name,
        string description,
        string image,
        uint256 deadline
    );

    event CandidateCreated(
        uint256 electionId,
        uint256 candidateId,
        string name,
        string description
    );

    event VoteSubmitted(
        uint256 indexed electionId,
        address indexed voter_address,
        uint256 indexed candidateId
    );

    struct CandidateResultStruct {
        string name;
        uint256 votes;
    }

    event ElectionEnded(
        uint256 indexed electionId,
        uint256 totalVotes,
        string winner,
        uint256 winnerVoteCount,
        CandidateResultStruct[] results
    );

    constructor() Ownable(msg.sender) {}

    modifier validElectionId(uint256 _electionId) {
        require(
            _electionId > 0 &&
                _electionId <= totalElection &&
                elections[_electionId].creator != address(0),
            "Invalid election ID"
        );
        _;
    }

    modifier isElectionActive(uint256 _electionId) {
        require(
            elections[_electionId].deadline > block.timestamp,
            "Election is not active"
        );
        _;
    }

    modifier isElectionEnded(uint256 _electionId) {
        require(
            elections[_electionId].deadline <= block.timestamp,
            "Election is still active"
        );
        _;
    }

    modifier validCandidateId(uint256 _electionId, uint256 _candidateId) {
        require(
            _candidateId > 0 &&
                _candidateId <= elections[_electionId].candidates.length &&
                elections[_electionId]
                    .candidates[_candidateId - 1]
                    .candidateId ==
                _candidateId,
            "Invalid candidate ID"
        );
        _;
    }

    /**
     * @notice Create a new election
     * @param _name Election name
     * @param _description Election description
     * @param _image Election image
     * @param _candidates_name Candidate names
     * @param _candidates_description Candidate descriptions
     * @param _deadline Election deadline
     */

    function createElection(
        string memory _name,
        string memory _description,
        string memory _image,
        string[] memory _candidates_name,
        string[] memory _candidates_description,
        uint256 _deadline
    ) public onlyOwner whenNotPaused {
        require(
            bytes(_name).length > 0 && bytes(_name).length <= 30,
            "Invalid name length (30 characters max)"
        );
        require(
            bytes(_description).length > 0 && bytes(_description).length <= 200,
            "Invalid description length (200 characters max)"
        );
        require(bytes(_image).length > 0, "Invalid image length");
        require(
            block.timestamp + (_deadline * 1 days) > block.timestamp,
            "Deadline must be in the future"
        );
        require(
            _candidates_name.length >= MIN_CANDIDATES &&
                _candidates_name.length <= MAX_CANDIDATES,
            "Candidates count must be between 2 and 10"
        );
        require(
            _candidates_name.length == _candidates_description.length,
            "Candidates name and description must be equal"
        );
        require(
            _deadline >= MINIMUM_DURATION_DAYS &&
                _deadline <= MAXIMUM_DURATION_DAYS,
            "Duration must be between 1 and 7 days"
        );

        for (uint256 i = 0; i < _candidates_name.length; i++) {
            require(
                bytes(_candidates_name[i]).length > 0,
                "Candidate name cannot be empty"
            );
            require(
                bytes(_candidates_description[i]).length > 0,
                "Candidate description cannot be empty"
            );

            for (uint256 j = i + 1; j < _candidates_name.length; j++) {
                require(
                    keccak256(bytes(_candidates_name[i])) !=
                        keccak256(bytes(_candidates_name[j])),
                    "Duplicate candidate names not allowed"
                );
            }
        }

        totalElection++;
        uint256 electionId = totalElection;
        uint256 deadline = block.timestamp + (_deadline * 1 days);

        ElectionStruct storage newElection = elections[electionId];
        newElection.id = electionId;
        newElection.creator = msg.sender;
        newElection.name = _name;
        newElection.description = _description;
        newElection.image = _image;
        newElection.deadline = deadline;
        newElection.totalVotes = 0;
        newElection.winner = "";

        for (uint256 i = 0; i < _candidates_name.length; i++) {
            newElection.candidates.push(
                CandidateStruct({
                    candidateId: i + 1,
                    name: _candidates_name[i],
                    description: _candidates_description[i],
                    voteCount: 0
                })
            );
            emit CandidateCreated(
                electionId,
                i + 1,
                _candidates_name[i],
                _candidates_description[i]
            );
        }
        allElectionIds.push(electionId);
        emit ElectionCreated(
            electionId,
            msg.sender,
            _name,
            _description,
            _image,
            deadline
        );
    }

    /**
     * @notice Vote for a candidate in an election
     * @param _electionId Election ID
     * @param _candidateId Candidate ID
     */

    function vote(
        uint256 _electionId,
        uint256 _candidateId
    )
        public
        validElectionId(_electionId)
        validCandidateId(_electionId, _candidateId)
        isElectionActive(_electionId)
        whenNotPaused
    {
        require(
            !elections[_electionId].hasVoted[msg.sender],
            "You have already voted for this election"
        );
        elections[_electionId].hasVoted[msg.sender] = true;
        uint256 index = _candidateId - 1;
        elections[_electionId].candidates[index].voteCount++;
        elections[_electionId].totalVotes++;
        emit VoteSubmitted(_electionId, msg.sender, _candidateId);
    }

    /**
     * @notice Calculate election result and declare winner with complete results
     * @param _electionId Election ID
     */
    function calculateElectionResult(
        uint256 _electionId
    )
        public
        onlyOwner
        validElectionId(_electionId)
        isElectionEnded(_electionId)
        whenNotPaused
    {
        require(
            bytes(elections[_electionId].winner).length == 0,
            "Election has already ended and a winner has been declared"
        );

        uint256 candidatesLength = elections[_electionId].candidates.length;
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        bool hasTie = false;

        CandidateResultStruct[] memory results = new CandidateResultStruct[](
            candidatesLength
        );

        for (uint256 i = 0; i < candidatesLength; ) {
            uint256 currentVotes = elections[_electionId]
                .candidates[i]
                .voteCount;

            results[i] = CandidateResultStruct({
                name: elections[_electionId].candidates[i].name,
                votes: currentVotes
            });

            if (currentVotes > maxVotes) {
                maxVotes = currentVotes;
                winnerIndex = i;
                hasTie = false;
            } else if (currentVotes == maxVotes && maxVotes > 0) {
                hasTie = true;
            }

            unchecked {
                ++i;
            }
        }

        string memory winnerName = hasTie
            ? "TIE - Multiple Winners"
            : elections[_electionId].candidates[winnerIndex].name;

        elections[_electionId].winner = winnerName;

        emit ElectionEnded(
            _electionId,
            elections[_electionId].totalVotes,
            winnerName,
            maxVotes,
            results
        );
    }

    /**
     * @notice Get election result
     * @param _electionId Election ID
     * @return string Winner name
     */

    function getElectionResult(
        uint256 _electionId
    )
        public
        view
        validElectionId(_electionId)
        isElectionEnded(_electionId)
        returns (string memory)
    {
        return elections[_electionId].winner;
    }

    /**
     * @notice Get election details
     * @param _electionId Election ID
     * @return ElectionView containing:
     *     - id: Election ID
     *     - name: Election name
     *     - description: Election description
     *     - image: Election image
     *     - deadline: Election deadline (timestamp)
     *     - totalVotes: Total votes so far
     *     - winner: Winner's name (empty if not ended)
     *     - candidates: Array of CandidateStruct
     *     - hasVoted: Whether the caller has voted
     */
    struct ElectionView {
        uint256 id;
        string name;
        string description;
        string image;
        uint256 deadline;
        uint256 totalVotes;
        string winner;
        CandidateStruct[] candidates;
        bool hasVoted;
    }

    function getElection(
        uint256 _electionId
    ) public view validElectionId(_electionId) returns (ElectionView memory) {
        ElectionStruct storage e = elections[_electionId];
        return
            ElectionView({
                id: e.id,
                name: e.name,
                description: e.description,
                image: e.image,
                deadline: e.deadline,
                totalVotes: e.totalVotes,
                winner: e.winner,
                candidates: e.candidates,
                hasVoted: e.hasVoted[msg.sender]
            });
    }

    /**
     * @notice Pause contract (emergency stop) (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Transfer ownership to a new address (only owner)
     * @param newOwner New owner address
     */
    function transferToNewOwner(address newOwner) external onlyOwner {
        transferOwnership(newOwner);
    }

    /**
     * @notice Fallbacks and Receive to prevent accidental ETH transfers from EOA
     */
    receive() external payable {
        revert("Direct ETH not allowed");
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
