"use client"

import { create } from 'zustand';
import { ethers } from 'ethers';
import { gql, request } from 'graphql-request';
import EthereumProvider from '@walletconnect/ethereum-provider';
import toast from 'react-hot-toast';

const CONTRACT_ADDRESS = '0x013491434Eb3E9FFE509f0b1A6C04508369866a7';
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            }
        ],
        "name": "CandidateCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "image",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "ElectionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalVotes",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "winner",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winnerVoteCount",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votes",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct VoteChain.CandidateResultStruct[]",
                "name": "results",
                "type": "tuple[]"
            }
        ],
        "name": "ElectionEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "electionId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter_address",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "VoteSubmitted",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [],
        "name": "MAXIMUM_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_CANDIDATES",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINIMUM_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MIN_CANDIDATES",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allElectionIds",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_electionId",
                "type": "uint256"
            }
        ],
        "name": "calculateElectionResult",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_image",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "_candidates_name",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "_candidates_description",
                "type": "string[]"
            },
            {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
            }
        ],
        "name": "createElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_electionId",
                "type": "uint256"
            }
        ],
        "name": "getElection",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "image",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalVotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "winner",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "candidateId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "description",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "voteCount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct VoteChain.CandidateStruct[]",
                        "name": "candidates",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "hasVoted",
                        "type": "bool"
                    }
                ],
                "internalType": "struct VoteChain.ElectionView",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_electionId",
                "type": "uint256"
            }
        ],
        "name": "getElectionResult",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalElection",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferToNewOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_electionId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

// WalletConnect configuration
const WC_PROJECT_ID = '9601996399f7776c59d80c3202e65abf';
const SUPPORTED_CHAIN_IDS = [1, 11155111];
const GRAPH_API_URL = 'https://api.studio.thegraph.com/query/114364/votechain-subgraph/v1';

// GraphQL Queries
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

const GET_ELECTION_DETAILS = gql`
  query GetElectionDetails($electionId: BigInt!) {
    electionCreateds(where: { internal_id: $electionId }) {
      id
      internal_id
      creator
      name
      description
      image
      deadline
      blockTimestamp
    }
    candidateCreateds(where: { electionId: $electionId }, orderBy: candidateId) {
      id
      electionId
      candidateId
      name
      description
    }
    voteSubmitteds(where: { electionId: $electionId }) {
      id
      voter_address
      candidateId
      blockTimestamp
    }
    electionEndeds(where: { electionId: $electionId }) {
      id
      winner
      totalVotes
      winnerVoteCount
      blockTimestamp
    }
  }
`;

const GET_USER_VOTES = gql`
  query GetUserVotes($userAddress: Bytes!) {
    voteSubmitteds(where: { voter_address: $userAddress }) {
      id
      electionId
      candidateId
      blockTimestamp
    }
  }
`;

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

const useVoteChainStore = create((set, get) => ({
    // Contract states
    contract: null,
    elections: [],
    totalElections: 0,
    contractOwner: null,
    isPaused: false,
    recentVotes: [],

    // Wallet states
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    wcProvider: null,
    loading: false,
    error: null,

    // Basic state setters
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setElections: (elections) => set({ elections }),

    executeContractCall: async (operationType, operation, ...args) => {
        try {
            set({ loading: true, error: null });
            const tx = await operation(...args);
            await tx.wait();
            await get().loadContractData();
            set({ loading: false });
            return tx;
        } catch (error) {
            console.error(`${operationType} operation failed:`, error);
            const errorMessage = error.code
                ? `Failed to ${operationType.toLowerCase()} because ${error.code.toLowerCase()}`
                : `Failed to ${operationType.toLowerCase()}. Please try again.`;
            toast.error(errorMessage);
            set({ loading: false, error: errorMessage });
            return null;
        }
    },

    connectWallet: async (walletType) => {
        try {
            set({ loading: true, error: null });
            let rawProvider = null;
            let ethersProvider = null;

            switch (walletType) {
                case 'metamask':
                    if (window.ethereum && window.ethereum.isMetaMask) {
                        rawProvider = window.ethereum;
                        await rawProvider.request({ method: 'eth_requestAccounts' });
                        toast.success('Connected to MetaMask successfully!');
                    } else {
                        window.open('https://metamask.io/download/', '_blank');
                        toast.error('Please install MetaMask');
                        set({ loading: false });
                        return;
                    }
                    break;

                case 'brave':
                    try {
                        if (window.navigator && window.navigator.brave) {
                            const isBraveBrowser = await window.navigator.brave.isBrave();
                            if (isBraveBrowser) {
                                if (window.ethereum && window.ethereum.isBraveWallet) {
                                    rawProvider = window.ethereum;
                                    await rawProvider.request({ method: 'eth_requestAccounts' });
                                    toast.success('Connected to Brave Wallet successfully!');
                                } else {
                                    toast.error('Enable Brave Wallet in your browser settings');
                                    setTimeout(() => {
                                        window.open('brave://settings/wallet', '_blank');
                                    }, 1000);
                                    set({ loading: false });
                                    return;
                                }
                            } else {
                                toast.error('Use Brave Browser with Brave Wallet enabled');
                                setTimeout(() => {
                                    window.open('https://brave.com/download/', '_blank');
                                }, 1000);
                                set({ loading: false });
                                return;
                            }
                        } else {
                            toast.error('Use Brave Browser with Brave Wallet enabled');
                            setTimeout(() => {
                                window.open('https://brave.com/download/', '_blank');
                            }, 1000);
                            set({ loading: false });
                            return;
                        }
                    } catch (error) {
                        console.error('Brave Wallet connection error:', error);
                        set({ loading: false, error: 'Brave Wallet connection error' });
                        return;
                    }
                    break;

                case 'walletconnect':
                    try {
                        if (!get().wcProvider) {
                            rawProvider = await EthereumProvider.init({
                                projectId: WC_PROJECT_ID,
                                chains: SUPPORTED_CHAIN_IDS,
                                showQrModal: true,
                                metadata: {
                                    name: 'VoteChain',
                                    description: 'Decentralized Voting Platform',
                                    url: window.location.origin
                                }
                            });
                            set({ wcProvider: rawProvider });
                        } else {
                            rawProvider = get().wcProvider;
                        }
                        await rawProvider.connect();
                        toast.success('Connected via WalletConnect');
                    } catch (error) {
                        console.error('WalletConnect initialization failed:', error);
                        toast.error('Failed to Connect, Try Again...');
                        set({ loading: false, error: 'WalletConnect initialization failed' });
                        return;
                    }
                    break;

                default:
                    toast.error('Unsupported wallet type');
                    set({ loading: false, error: 'Unsupported wallet type' });
                    return;
            }

            ethersProvider = new ethers.BrowserProvider(rawProvider);

            const setupEventListeners = () => {
                const handleAccountsChanged = async (accounts) => {
                    // No accounts: disconnected from external wallet
                    if (!accounts || accounts.length === 0) {
                        set({
                            account: null,
                            signer: null,
                            contract: null,
                            elections: [],
                            totalElections: 0,
                            contractOwner: null,
                            isPaused: false,
                        });
                        toast.error('Disconnected: you disconnected from your wallet');
                    } else {
                        try {
                            const newSigner = await ethersProvider.getSigner();
                            const newAddress = await newSigner.getAddress();
                            const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
                            set({
                                signer: newSigner,
                                account: newAddress,
                                contract: newContract
                            });
                            toast.success(`Account changed: ${newAddress}`);
                            await get().loadContractData();
                        } catch (err) {
                            toast.error('Error updating after account change');
                        }
                    }
                };

                const handleChainChanged = async (chainIdHex) => {
                    try {
                        const numericChainId = Number(chainIdHex);
                        set({ chainId: numericChainId });
                        toast.success(`Network changed to chainId ${numericChainId}`);

                        const newSigner = await ethersProvider.getSigner();
                        const newAddress = await newSigner.getAddress();
                        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
                        set({
                            signer: newSigner,
                            account: newAddress,
                            contract: newContract
                        });

                        // Check if supported network
                        if (!SUPPORTED_CHAIN_IDS.includes(numericChainId)) {
                            toast.error(`Unsupported network (chainId ${numericChainId}). Please switch to a supported network.`);
                        } else {
                            await get().loadContractData();
                        }
                    } catch (err) {
                        toast.error('Error updating after network change');
                    }
                };

                const handleDisconnect = () => {
                    set({
                        account: null,
                        signer: null,
                        contract: null,
                        provider: null,
                        elections: [],
                        totalElections: 0,
                        contractOwner: null,
                        isPaused: false,
                    });
                    toast.error('Wallet disconnected');
                };

                rawProvider.on('accountsChanged', handleAccountsChanged);
                rawProvider.on('chainChanged', handleChainChanged);
                rawProvider.on('disconnect', handleDisconnect);

                rawProvider._voteChainEventHandlers = {
                    handleAccountsChanged,
                    handleChainChanged,
                    handleDisconnect
                };
            };

            setupEventListeners();

            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            const network = await ethersProvider.getNetwork();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            set({
                provider: ethersProvider,
                signer,
                account: address,
                chainId: Number(network.chainId),
                contract,
                loading: false
            });

            await get().loadContractData();

            return { signer, address, network };
        } catch (error) {
            console.error('Wallet connection failed:', error);
            toast.error(error.message || 'Failed to connect wallet');
            set({ loading: false, error: error.message || 'Failed to connect wallet' });
        }
    },

    disconnectWallet: async () => {
        try {
            const { wcProvider } = get();

            if (window.ethereum && window.ethereum._voteChainEventHandlers) {
                const { handleAccountsChanged, handleChainChanged, handleDisconnect } = window.ethereum._voteChainEventHandlers;
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('disconnect', handleDisconnect);
                delete window.ethereum._voteChainEventHandlers;
            }

            if (wcProvider) {
                if (wcProvider._voteChainEventHandlers) {
                    const { handleAccountsChanged, handleChainChanged, handleDisconnect } = wcProvider._voteChainEventHandlers;
                    wcProvider.removeListener('accountsChanged', handleAccountsChanged);
                    wcProvider.removeListener('chainChanged', handleChainChanged);
                    wcProvider.removeListener('disconnect', handleDisconnect);
                    delete wcProvider._voteChainEventHandlers;
                }
                try {
                    await wcProvider.disconnect();
                } catch (err) {
                    console.warn('Error disconnecting WalletConnect provider:', err);
                }
            }

            set({
                account: null,
                chainId: null,
                provider: null,
                signer: null,
                contract: null,
                elections: [],
                totalElections: 0,
                contractOwner: null,
                isPaused: false,
                wcProvider: null,
                loading: false,
                error: null
            });

            toast.success('Wallet disconnected');
        } catch (error) {
            console.error('Disconnect failed:', error);
            toast.error(error.message || 'Failed to disconnect wallet');
            set({ error: error.message || 'Failed to disconnect wallet' });
        }
    },

    loadContractData: async () => {
        try {
            const { contract } = get();
            if (!contract) return;

            set({ loading: true, error: null });

            const [totalElection, isPaused, owner] = await Promise.all([
                contract.totalElection(),
                contract.paused(),
                contract.owner()
            ]);

            set({
                totalElections: Number(totalElection),
                isPaused,
                contractOwner: owner,
                loading: false
            });

            // Also load elections from TheGraph
            await get().fetchElections();
        } catch (error) {
            console.error('Failed to load contract data:', error);
            toast.error('Failed to load contract data');
            set({ loading: false, error: 'Failed to load contract data' });
        }
    },

    // TheGraph queries
    fetchElections: async (limit = 10) => {
        try {
            set({ loading: true, error: null });

            const data = await request(GRAPH_API_URL, GET_ELECTIONS, { first: limit });
            set({
                elections: data.electionCreateds,
                loading: false
            });

            return data.electionCreateds;
        } catch (error) {
            console.error('Failed to fetch elections:', error);
            set({
                error: error.message || 'Failed to fetch elections',
                loading: false
            });
        }
    },

    fetchElectionDetails: async (electionId) => {
        try {
            set({ loading: true, error: null });

            const data = await request(GRAPH_API_URL, GET_ELECTION_DETAILS, {
                electionId: electionId
            });

            // Process the data to create a structured election object
            if (!data || !data.electionCreateds || data.electionCreateds.length === 0) {
                set({ loading: false });
                return null;
            }

            const electionBasic = data.electionCreateds[0];
            const candidates = data.candidateCreateds || [];
            const votes = data.voteSubmitteds || [];
            const endedData = data.electionEndeds && data.electionEndeds.length > 0 ? data.electionEndeds[0] : null;

            // Calculate votes per candidate
            const candidatesWithVotes = candidates.map(candidate => {
                const candidateVotes = votes.filter(vote => vote.candidateId === candidate.candidateId);
                return {
                    ...candidate,
                    voteCount: candidateVotes.length.toString()
                };
            });

            // Construct the final election object
            const election = {
                ...electionBasic,
                candidates: candidatesWithVotes,
                totalVotes: votes.length,
                hasEnded: endedData !== null,
                winner: endedData ? endedData.winner : null,
                winnerVoteCount: endedData ? endedData.winnerVoteCount : null
            };

            set({ loading: false });
            return election;
        } catch (error) {
            console.error('Failed to fetch election details:', error);
            set({
                error: error.message || 'Failed to fetch election details',
                loading: false
            });
            return null;
        }
    },

    fetchUserVotes: async (userAddress) => {
        try {
            set({ loading: true, error: null });

            const data = await request(GRAPH_API_URL, GET_USER_VOTES, {
                userAddress: userAddress
            });

            set({ loading: false });
            return data.voteSubmitteds;
        } catch (error) {
            console.error('Failed to fetch user votes:', error);
            set({
                error: error.message || 'Failed to fetch user votes',
                loading: false
            });
        }
    },

    fetchRecentVotes: async (electionId, limit = 10) => {
        try {
            set({ loading: true, error: null });

            const data = await request(GRAPH_API_URL, GET_RECENT_VOTES, {
                electionId: electionId,
                first: limit
            });

            set({
                recentVotes: data.voteSubmitteds,
                loading: false
            });

            return data.voteSubmitteds;
        } catch (error) {
            console.error('Failed to fetch recent votes:', error);
            set({
                error: error.message || 'Failed to fetch recent votes',
                loading: false
            });
        }
    },

    // Contract interactions
    createElection: async (name, description, image, candidateNames, candidateDescriptions, durationDays) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Create election',
            async () => contract.createElection(
                name,
                description,
                image,
                candidateNames,
                candidateDescriptions,
                durationDays
            ),
            name, description, image, candidateNames, candidateDescriptions, durationDays
        );
    },

    vote: async (electionId, candidateId) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Vote',
            async () => contract.vote(electionId, candidateId),
            electionId, candidateId
        );
    },

    calculateElectionResult: async (electionId) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Calculate election result',
            async () => contract.calculateElectionResult(electionId),
            electionId
        );
    },

    getElection: async (electionId) => {
        try {
            const { contract } = get();
            if (!contract) {
                toast.error('Wallet not connected');
                return null;
            }

            set({ loading: true, error: null });
            const election = await contract.getElection(electionId);
            set({ loading: false });

            return election;
        } catch (error) {
            console.error('Failed to get election:', error);
            toast.error('Failed to get election details');
            set({ loading: false, error: 'Failed to get election details' });
            return null;
        }
    },

    getElectionResult: async (electionId) => {
        try {
            const { contract } = get();
            if (!contract) {
                toast.error('Wallet not connected');
                return null;
            }

            set({ loading: true, error: null });
            const result = await contract.getElectionResult(electionId);
            set({ loading: false });

            return result;
        } catch (error) {
            console.error('Failed to get election result:', error);
            toast.error('Failed to get election result');
            set({ loading: false, error: 'Failed to get election result' });
            return null;
        }
    },

    // Admin-only functions
    pauseContract: async () => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Pause contract',
            async () => contract.pause()
        );
    },

    unpauseContract: async () => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Unpause contract',
            async () => contract.unpause()
        );
    },

    transferOwnership: async (newOwnerAddress) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'Transfer ownership',
            async () => contract.transferToNewOwner(newOwnerAddress),
            newOwnerAddress
        );
    },

    // Helper functions
    isOwner: () => {
        const { account, contractOwner } = get();
        return account && contractOwner && account.toLowerCase() === contractOwner.toLowerCase();
    },

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
    },

    formatTimestamp: (timestamp) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    },

    checkIfUserVoted: async (electionId) => {
        try {
            const { account } = get();
            if (!account) {
                return false;
            }

            set({ loading: true, error: null });

            // Fetch the user's votes
            const data = await request(GRAPH_API_URL, GET_USER_VOTES, {
                userAddress: account
            });

            // Check if any of the votes are for the specified election
            const hasVoted = data &&
                data.voteSubmitteds &&
                data.voteSubmitteds.some(vote => vote.electionId === electionId);

            set({ loading: false });
            return hasVoted;
        } catch (error) {
            console.error('Failed to check if user voted:', error);
            set({
                error: error.message || 'Failed to check voting status',
                loading: false
            });
            return false;
        }
    },
}));

export default useVoteChainStore;