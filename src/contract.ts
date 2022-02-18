import {ethers} from "ethers";
import {MetaFarmers} from "../../../assets/types/MetaFarmers";

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const provider = new ethers.providers.AlchemyProvider("rinkeby", "CfvEkiXhOqaySnuoeZONQchJI6A4wx9R");

//const providerWS = new ethers.providers.AlchemyWebSocketProvider ("rinkeby","CfvEkiXhOqaySnuoeZONQchJI6A4wx9R");
interface Web3Object {
    contract: string,
    provider: typeof ethers.providers
}

export interface Farmer {
    readonly address: string,
    isOg: boolean,
    isWhitelist: boolean,
    ogRedeemed: number,
    whitelistRedeemed: number,
    publicRedeemed: number,
    ownedToken: number,
}


export interface Token {
    readonly id: number,
    url?: string,
}

export interface FarmerState {
    currentWorkflowName: string,
    currentPrice: number,
    isPaused: boolean
}

export function getContract(providerWeb3?: ethers.providers.Web3Provider): ethers.Contract {
    console.log(contractAddress, provider)
    const contract = new ethers.Contract(
        contractAddress,
        ABI.abi,
        providerWeb3 ?? provider
    );
    return contract.connect(provider) as MetaFarmers;

}

export async function populate(farmer?: Farmer, state?: FarmerState): Promise<number> {
    const contract = getContract() as MetaFarmers
    if (farmer && farmer.address) {
        console.log("Farmer is OK")
        farmer.ownedToken = (await contract.balanceOf(farmer.address)).toNumber()
        return farmer.ownedToken
    }
    return 0
}


export async function generateFarmerState(): Promise<FarmerState> {
    const contract = getContract() as MetaFarmers
    const status = (await contract.workflow())
    const currentWorkflowName = workflowToString(status)
    let currentPrice: number
    if (status == 3) {
        currentPrice = (await contract.WHITELIST_PRICE()).toNumber()
    } else {
        currentPrice = (await contract.PRICE()).toNumber()
    }
    const isPaused = (await contract.paused())
    return {
        currentWorkflowName,
        currentPrice,
        isPaused
    }
}

export async function generateFarmer(address: string): Promise<Farmer> {
    const contract = getContract() as MetaFarmers
    const ownedToken = (await contract.balanceOf(address)).toNumber()
    const ogRedeemed = (await contract.raffleRedeemed(address)).toNumber()
    const isWhitelist = false
    const whitelistRedeemed = (await contract.privateRedeemed(address)).toNumber()
    const publicRedeemed = (await contract.publicRedeemed(address)).toNumber()
    return {
        address: address,
        ownedToken: ownedToken,
        ogRedeemed: ogRedeemed,
        isOg: false,
        isWhitelist: isWhitelist,
        whitelistRedeemed: whitelistRedeemed,
        publicRedeemed: publicRedeemed,
    }
}

function workflowToString(status: number): string {
    switch (status) {
        case 1:
            return "ogSales";
        case 2:
            return "ogPrivateSales";
        case 3:
            return "Private";
        case 4:
            return "Public";
        default:
            break;
    }
    throw "Cant Get Status";
}

const ABI = {
    "_format": "hh-sol-artifact-1",
    "contractName": "JeanCode",
    "sourceName": "contracts/JeanCode.sol",
    "abi": [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_initNotRevealedUri",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "_raffleWhitelist",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "_privateWhitelist",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract IERC20",
                    "name": "token",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "ERC20PaymentReleased",
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
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "shares",
                    "type": "uint256"
                }
            ],
            "name": "PayeeAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "PaymentReceived",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "PaymentReleased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_minter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "PrivateMint",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_minter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "PublicMint",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_minter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "RaffleMint",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
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
            "inputs": [],
            "name": "GIFT_SUPPLY",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "MAX_SUPPLY",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "PRICE",
            "outputs": [
                {
                    "internalType": "uint128",
                    "name": "",
                    "type": "uint128"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "RAFFLE_PRICE",
            "outputs": [
                {
                    "internalType": "uint128",
                    "name": "",
                    "type": "uint128"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "RAFFLE_SUPPLY",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "WHITELIST_PRICE",
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
            "name": "WHITELIST_SUPPLY",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
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
            "name": "baseURI",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
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
            "name": "getWorkflowStatus",
            "outputs": [
                {
                    "internalType": "enum JeanCode.WorkflowStatus",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "_mintAmount",
                    "type": "uint64"
                }
            ],
            "name": "gift",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_mintAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "giveawayAddress",
                    "type": "address"
                }
            ],
            "name": "giveaway",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
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
            "name": "name",
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
            "name": "notRevealedUri",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "payee",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "privateRedeemed",
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
            "name": "privateWhitelist",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "publicRedeemed",
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
            "name": "publicRedeemedCount",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "amount",
                    "type": "uint64"
                }
            ],
            "name": "publicSaleMint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "raffleRedeemed",
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
            "name": "raffleRedeemedCount",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "raffleWhitelist",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "amount",
                    "type": "uint64"
                },
                {
                    "internalType": "bytes32[]",
                    "name": "proof",
                    "type": "bytes32[]"
                }
            ],
            "name": "redeemPrivateSale",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "amount",
                    "type": "uint64"
                },
                {
                    "internalType": "bytes32[]",
                    "name": "proof",
                    "type": "bytes32[]"
                }
            ],
            "name": "redeemRaffle",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "release",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "release",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "released",
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
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "released",
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
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "revealedBaseURI",
                    "type": "string"
                }
            ],
            "name": "reveal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revealed",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newBaseURI",
                    "type": "string"
                }
            ],
            "name": "setBaseURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_notRevealedURI",
                    "type": "string"
                }
            ],
            "name": "setNotRevealedURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "setPrivateSaleEnabled",
            "outputs": [
                {
                    "internalType": "enum JeanCode.WorkflowStatus",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "setPublicSaleEnabled",
            "outputs": [
                {
                    "internalType": "enum JeanCode.WorkflowStatus",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "setRaffleSaleEnabled",
            "outputs": [
                {
                    "internalType": "enum JeanCode.WorkflowStatus",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "whitelist_",
                    "type": "bytes32"
                }
            ],
            "name": "setWhitelist",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "shares",
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
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
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
            "name": "symbol",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
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
            "inputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "token",
                    "type": "address"
                }
            ],
            "name": "totalReleased",
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
            "name": "totalReleased",
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
            "name": "totalShares",
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
            "name": "totalSupply",
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
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
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
            "name": "transferOwnership",
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
            "inputs": [],
            "name": "whitelistRedeemedCount",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "workflow",
            "outputs": [
                {
                    "internalType": "enum JeanCode.WorkflowStatus",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ],
    "bytecode": "0x61014060405273483aacff26559a05d42a7431c41bc2b0002bce666080908152735b8b3ee5d2d99537e0dbe24b01353a38529d972760a052732828d3280801b15c5061f80f752be4130adea2ed60c05273584be9377137d1c34b13ff1d6c8d556fec44810060e052735bd342aade55c91aa75694aeef9a10a828e23cf061010052730323196bd6f5ed0ccc8b0f90edc8b11435fb7c6161012052620000a990601690600662000715565b506040805160c081018252610c088152610b0060208201526107e891810191909152610370606082015260c860808201526103e860a0820152620000f29060179060066200077f565b503480156200010057600080fd5b506040516200479038038062004790833981016040819052620001239162000857565b60168054806020026020016040519081016040528092919081815260200182805480156200017b57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116200015c575b50505050506017805480602002602001604051908101604052809291908181526020018280548015620001ce57602002820191906000526020600020905b815481526020019060010190808311620001b9575b505060408051808201825260088152674a65616e436f646560c01b60208083019182528351808501909452600384526226aa2360e91b90840152815191955091935062000220925060009190620007c3565b50805162000236906001906020840190620007c3565b5050508051825114620002ab5760405162461bcd60e51b815260206004820152603260248201527f5061796d656e7453706c69747465723a2070617965657320616e6420736861726044820152710cae640d8cadccee8d040dad2e6dac2e8c6d60731b60648201526084015b60405180910390fd5b6000825111620002fe5760405162461bcd60e51b815260206004820152601a60248201527f5061796d656e7453706c69747465723a206e6f207061796565730000000000006044820152606401620002a2565b60005b82518110156200036a576200035583828151811062000324576200032462000a08565b602002602001015183838151811062000341576200034162000a08565b6020026020010151620003c360201b60201c565b806200036181620009d4565b91505062000301565b5050600d805460ff19169055506200038233620005b1565b6001600e5562000392336200060b565b6018805460ff19908116909155601580549091169055620003b383620006b4565b601b91909155601c555062000a34565b6001600160a01b038216620004305760405162461bcd60e51b815260206004820152602c60248201527f5061796d656e7453706c69747465723a206163636f756e74206973207468652060448201526b7a65726f206164647265737360a01b6064820152608401620002a2565b60008111620004825760405162461bcd60e51b815260206004820152601d60248201527f5061796d656e7453706c69747465723a207368617265732061726520300000006044820152606401620002a2565b6001600160a01b03821660009081526008602052604090205415620004fe5760405162461bcd60e51b815260206004820152602b60248201527f5061796d656e7453706c69747465723a206163636f756e7420616c726561647960448201526a206861732073686172657360a81b6064820152608401620002a2565b600a8054600181019091557fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a80180546001600160a01b0319166001600160a01b0384169081179091556000908152600860205260409020819055600654620005689082906200097c565b600655604080516001600160a01b0384168152602081018390527f40c340f65e17194d14ddddb073d3c9f888e3cb52b5aae0c6c7706b4fbc905fac910160405180910390a15050565b600d80546001600160a01b03838116610100818102610100600160a81b031985161790945560405193909204169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b336200061662000701565b6001600160a01b0316146200063f5760405162461bcd60e51b8152600401620002a29062000947565b6001600160a01b038116620006a65760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401620002a2565b620006b181620005b1565b50565b33620006bf62000701565b6001600160a01b031614620006e85760405162461bcd60e51b8152600401620002a29062000947565b8051620006fd90601a906020840190620007c3565b5050565b600d5461010090046001600160a01b031690565b8280548282559060005260206000209081019282156200076d579160200282015b828111156200076d57825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019062000736565b506200077b92915062000840565b5090565b8280548282559060005260206000209081019282156200076d579160200282015b828111156200076d578251829061ffff16905591602001919060010190620007a0565b828054620007d19062000997565b90600052602060002090601f016020900481019282620007f557600085556200076d565b82601f106200081057805160ff19168380011785556200076d565b828001600101855582156200076d579182015b828111156200076d57825182559160200191906001019062000823565b5b808211156200077b576000815560010162000841565b6000806000606084860312156200086d57600080fd5b83516001600160401b03808211156200088557600080fd5b818601915086601f8301126200089a57600080fd5b815181811115620008af57620008af62000a1e565b604051601f8201601f19908116603f01168101908382118183101715620008da57620008da62000a1e565b81604052828152602093508984848701011115620008f757600080fd5b600091505b828210156200091b5784820184015181830185015290830190620008fc565b828211156200092d5760008484830101525b928801516040909801519299979850919695505050505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60008219821115620009925762000992620009f2565b500190565b600181811c90821680620009ac57607f821691505b60208210811415620009ce57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415620009eb57620009eb620009f2565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b613d4c8062000a446000396000f3fe6080604052600436106102b65760003560e01c80630189c66c146102fb57806301ffc9a71461033f57806306fdde031461036f578063081812fc14610391578063081c8c44146103be578063095ea7b3146103d357806317e7f295146103f557806318160ddd1461041e57806319165587146104335780631ea639011461045357806323b872dd146104685780632fc66c1a1461048857806332cb6b0c146104af5780633a98ef39146104c45780633c0a1d09146104d95780633f4ba83a146104f9578063406072a91461050e57806342842e0e1461052e578063440bc7f31461054e57806348b750441461056e578063490772231461058e5780634c261247146105a157806351830227146105c157806355e39d9b146105db57806355f804b3146105fb5780635c975abb1461061b5780636352211e146106335780636c0360eb146106535780636e56539b1461066857806370a082311461067d578063715018a61461069d5780638456cb59146106b25780638b83209b146106c75780638d859f3e146106e75780638da5cb5b1461071a57806395d89b411461072f5780639852595c146107445780639939494b14610764578063a22cb46514610786578063a3344125146107a6578063a65e83f8146107c0578063b03a2340146107d5578063b88d4fde14610802578063c87b56dd14610822578063ce7c2ac214610842578063d17a18cd14610878578063d2eca8341461088e578063d3e46dce146108bb578063d63dd701146108e8578063d79779b2146108fb578063d82c7dcb1461091b578063dc61764a1461092e578063dc69591614610944578063e2298c7414610964578063e33b7de314610979578063e3bba1691461098e578063e985e9c5146109a3578063ee1e36bd146106e7578063f2c4ce1e146109c3578063f2fde38b146109e3578063f75d64a614610a0357600080fd5b366102f6577f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be77033346040516102ec929190613788565b60405180910390a1005b600080fd5b34801561030757600080fd5b5060115461032290600160801b90046001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b34801561034b57600080fd5b5061035f61035a36600461359d565b610a1b565b6040519015158152602001610336565b34801561037b57600080fd5b50610384610a6d565b6040516103369190613806565b34801561039d57600080fd5b506103b16103ac366004613584565b610aff565b6040516103369190613774565b3480156103ca57600080fd5b50610384610b8c565b3480156103df57600080fd5b506103f36103ee36600461353b565b610c1a565b005b34801561040157600080fd5b50610410662386f26fc1000081565b604051908152602001610336565b34801561042a57600080fd5b50610410610d2b565b34801561043f57600080fd5b506103f361044e3660046133f7565b610d37565b34801561045f57600080fd5b50610322600581565b34801561047457600080fd5b506103f361048336600461344d565b610e46565b34801561049457600080fd5b5060115461032290600160401b90046001600160401b031681565b3480156104bb57600080fd5b50610322600b81565b3480156104d057600080fd5b50600654610410565b3480156104e557600080fd5b506103f36104f4366004613638565b610e77565b34801561050557600080fd5b506103f3610f6d565b34801561051a57600080fd5b50610410610529366004613414565b610fa6565b34801561053a57600080fd5b506103f361054936600461344d565b610fd1565b34801561055a57600080fd5b506103f3610569366004613584565b610fec565b34801561057a57600080fd5b506103f3610589366004613414565b611020565b6103f361059c366004613678565b6111d6565b3480156105ad57600080fd5b506103f36105bc3660046135d7565b611633565b3480156105cd57600080fd5b5060185461035f9060ff1681565b3480156105e757600080fd5b506103f36105f636600461365d565b611686565b34801561060757600080fd5b506103f36106163660046135d7565b611791565b34801561062757600080fd5b50600d5460ff1661035f565b34801561063f57600080fd5b506103b161064e366004613584565b6117d7565b34801561065f57600080fd5b5061038461184e565b34801561067457600080fd5b50610322600181565b34801561068957600080fd5b506104106106983660046133f7565b61185b565b3480156106a957600080fd5b506103f36118e2565b3480156106be57600080fd5b506103f361191b565b3480156106d357600080fd5b506103b16106e2366004613584565b611952565b3480156106f357600080fd5b50610702662386f26fc1000081565b6040516001600160801b039091168152602001610336565b34801561072657600080fd5b506103b1611982565b34801561073b57600080fd5b50610384611996565b34801561075057600080fd5b5061041061075f3660046133f7565b6119a5565b34801561077057600080fd5b506107796119c0565b60405161033691906137de565b34801561079257600080fd5b506103f36107a136600461350d565b611a0f565b3480156107b257600080fd5b506015546107799060ff1681565b3480156107cc57600080fd5b50610322600281565b3480156107e157600080fd5b506104106107f03660046133f7565b60146020526000908152604090205481565b34801561080e57600080fd5b506103f361081d36600461348e565b611a1a565b34801561082e57600080fd5b5061038461083d366004613584565b611a4c565b34801561084e57600080fd5b5061041061085d3660046133f7565b6001600160a01b031660009081526008602052604090205490565b34801561088457600080fd5b50610410601c5481565b34801561089a57600080fd5b506104106108a93660046133f7565b60126020526000908152604090205481565b3480156108c757600080fd5b506104106108d63660046133f7565b60136020526000908152604090205481565b6103f36108f636600461365d565b611bca565b34801561090757600080fd5b506104106109163660046133f7565b611f32565b6103f3610929366004613678565b611f4d565b34801561093a57600080fd5b50610410601b5481565b34801561095057600080fd5b50601154610322906001600160401b031681565b34801561097057600080fd5b5061077961230e565b34801561098557600080fd5b50600754610410565b34801561099a57600080fd5b50610779612353565b3480156109af57600080fd5b5061035f6109be366004613414565b612398565b3480156109cf57600080fd5b506103f36109de3660046135d7565b6123c6565b3480156109ef57600080fd5b506103f36109fe3660046133f7565b612408565b348015610a0f57600080fd5b5060155460ff16610779565b60006001600160e01b031982166380ac58cd60e01b1480610a4c57506001600160e01b03198216635b5e139f60e01b145b80610a6757506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060008054610a7c90613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054610aa890613ba5565b8015610af55780601f10610aca57610100808354040283529160200191610af5565b820191906000526020600020905b815481529060010190602001808311610ad857829003601f168201915b5050505050905090565b6000610b0a826124a8565b610b705760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b601a8054610b9990613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054610bc590613ba5565b8015610c125780601f10610be757610100808354040283529160200191610c12565b820191906000526020600020905b815481529060010190602001808311610bf557829003601f168201915b505050505081565b6000610c25826117d7565b9050806001600160a01b0316836001600160a01b03161415610c935760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610b67565b336001600160a01b0382161480610caf5750610caf8133612398565b610d1c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776044820152771b995c881b9bdc88185c1c1c9bdd995908199bdc88185b1b60421b6064820152608401610b67565b610d2683836124c5565b505050565b600080610a6760105490565b6001600160a01b038116600090815260086020526040902054610d6c5760405162461bcd60e51b8152600401610b67906138e5565b6000610d7760075490565b610d819047613af5565b90506000610d988383610d93866119a5565b612533565b905080610db75760405162461bcd60e51b8152600401610b6790613959565b6001600160a01b03831660009081526009602052604081208054839290610ddf908490613af5565b925050819055508060076000828254610df89190613af5565b90915550610e0890508382612579565b7fdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b0568382604051610e39929190613788565b60405180910390a1505050565b610e50338261268f565b610e6c5760405162461bcd60e51b8152600401610b6790613a8b565b610d26838383612751565b33610e80611982565b6001600160a01b031614610ea65760405162461bcd60e51b8152600401610b67906139ce565b60008211610ec65760405162461bcd60e51b8152600401610b67906138a0565b600082610ed260105490565b610edc9190613af5565b9050600b811115610eff5760405162461bcd60e51b8152600401610b679061392b565b82600b81610f0c60105490565b610f169190613af5565b1415610f2a576015805460ff191660041790555b60015b818111610f6657610f42601080546001019055565b610f5484610f4f60105490565b6128df565b80610f5e81613be0565b915050610f2d565b5050505050565b33610f76611982565b6001600160a01b031614610f9c5760405162461bcd60e51b8152600401610b67906139ce565b610fa46128f9565b565b6001600160a01b039182166000908152600c6020908152604080832093909416825291909152205490565b610d2683838360405180602001604052806000815250611a1a565b33610ff5611982565b6001600160a01b03161461101b5760405162461bcd60e51b8152600401610b67906139ce565b601b55565b6001600160a01b0381166000908152600860205260409020546110555760405162461bcd60e51b8152600401610b67906138e5565b600061106083611f32565b6040516370a0823160e01b81526001600160a01b038516906370a082319061108c903090600401613774565b60206040518083038186803b1580156110a457600080fd5b505afa1580156110b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110dc919061361f565b6110e69190613af5565b905060006110f98383610d938787610fa6565b9050806111185760405162461bcd60e51b8152600401610b6790613959565b6001600160a01b038085166000908152600c602090815260408083209387168352929052908120805483929061114f908490613af5565b90915550506001600160a01b0384166000908152600b60205260408120805483929061117c908490613af5565b9091555061118d9050848483612986565b836001600160a01b03167f3be5b7a71e84ed12875d241991c70855ac5817d847039e17a9d895c1ceb0f18a84836040516111c8929190613788565b60405180910390a250505050565b600d5460ff16156111f95760405162461bcd60e51b8152600401610b67906139a4565b6000836001600160401b0316116112225760405162461bcd60e51b8152600401610b6790613a54565b600460155460ff16600581111561123b5761123b613c3b565b14156112595760405162461bcd60e51b8152600401610b6790613a27565b600260155460ff16600581111561127257611272613c3b565b146112d55760405162461bcd60e51b815260206004820152602d60248201527f4a65616e436f64653a20707269766174652073616c65206973206e6f7420737460448201526c6172746564207965742069696960981b6064820152608401610b67565b600061131e6112e53360016129dc565b848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250612a1e92505050565b9050806113885760405162461bcd60e51b815260206004820152603260248201527f61646472657373206e6f74207665726966696564206f6e207468652070726976604482015271185d19481cd85b19481dda1a5d195b1a5cdd60721b6064820152608401610b67565b6011546113a6908590600160801b90046001600160401b0316613b0d565b6001600160401b03166001101561140b5760405162461bcd60e51b81526020600482015260356024820152600080516020613cd7833981519152604482015274081c1c9a5d985d19481cdd5c1c1b1e481b1a5b5a5d605a1b6064820152608401610b67565b33600090815260136020526040812054662386f26fc1000091600191906001600160401b03881661143b60105490565b6114459190613af5565b90506001600160801b0383166114646001600160401b038a1684613af5565b11156114b55760405162461bcd60e51b815260206004820152602c6024820152600080516020613cf783398151915260448201526b616e203120746f6b656e732160a01b6064820152608401610b67565b600b8111156114d65760405162461bcd60e51b8152600401610b6790613a03565b346114ea6001600160401b038a1686613b43565b11156115085760405162461bcd60e51b8152600401610b6790613819565b601154611526908990600160801b90046001600160401b0316613b0d565b601160106101000a8154816001600160401b0302191690836001600160401b03160217905550336001600160a01b03167f5a9bb1a07cf4b32f75aadb39ccc14dfdc985cb16bdddd078a7959ee819258cf48986604051611587929190613adc565b60405180910390a260016001600160401b038916600b816115a760105490565b6115b19190613af5565b14156115c5576015805460ff191660041790555b336000908152601360205260409020546115e0908290613af5565b33600090815260136020526040902055815b81811161162657611607601080546001019055565b61161433610f4f60105490565b8061161e81613be0565b9150506115f2565b5050505050505050505050565b3361163c611982565b6001600160a01b0316146116625760405162461bcd60e51b8152600401610b67906139ce565b80516116759060199060208401906132cd565b50506018805460ff19166001179055565b3361168f611982565b6001600160a01b0316146116b55760405162461bcd60e51b8152600401610b67906139ce565b6000816001600160401b0316116116de5760405162461bcd60e51b8152600401610b67906138a0565b6000816001600160401b03166116f360105490565b6116fd9190613af5565b9050600b8111156117205760405162461bcd60e51b8152600401610b679061392b565b6001600160401b038216600b8161173660105490565b6117409190613af5565b1415611754576015805460ff191660041790555b60015b81811161178b5761176c601080546001019055565b61177933610f4f60105490565b8061178381613be0565b915050611757565b50505050565b3361179a611982565b6001600160a01b0316146117c05760405162461bcd60e51b8152600401610b67906139ce565b80516117d39060199060208401906132cd565b5050565b6000818152600260205260408120546001600160a01b031680610a675760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610b67565b60198054610b9990613ba5565b60006001600160a01b0382166118c65760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610b67565b506001600160a01b031660009081526003602052604090205490565b336118eb611982565b6001600160a01b0316146119115760405162461bcd60e51b8152600401610b67906139ce565b610fa46000612a2d565b33611924611982565b6001600160a01b03161461194a5760405162461bcd60e51b8152600401610b67906139ce565b610fa4612a87565b6000600a828154811061196757611967613c51565b6000918252602090912001546001600160a01b031692915050565b600d5461010090046001600160a01b031690565b606060018054610a7c90613ba5565b6001600160a01b031660009081526009602052604090205490565b6000336119cb611982565b6001600160a01b0316146119f15760405162461bcd60e51b8152600401610b67906139ce565b601580546001919060ff191682805b02179055505060155460ff1690565b6117d3338383612adf565b611a24338361268f565b611a405760405162461bcd60e51b8152600401610b6790613a8b565b61178b84848484612baa565b60185460609060ff16611aeb57601a8054611a6690613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054611a9290613ba5565b8015611adf5780601f10611ab457610100808354040283529160200191611adf565b820191906000526020600020905b815481529060010190602001808311611ac257829003601f168201915b50505050509050919050565b600060198054611afa90613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054611b2690613ba5565b8015611b735780601f10611b4857610100808354040283529160200191611b73565b820191906000526020600020905b815481529060010190602001808311611b5657829003601f168201915b505050505090506000815111611b985760405180602001604052806000815250611bc3565b80611ba284612bdd565b604051602001611bb3929190613745565b6040516020818303038152906040525b9392505050565b6002600e541415611c1d5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610b67565b6002600e55600d5460ff1615611c455760405162461bcd60e51b8152600401610b67906139a4565b6000816001600160401b031611611c6e5760405162461bcd60e51b8152600401610b6790613a54565b600460155460ff166005811115611c8757611c87613c3b565b1415611ca55760405162461bcd60e51b8152600401610b6790613a27565b600360155460ff166005811115611cbe57611cbe613c3b565b14611d1c5760405162461bcd60e51b815260206004820152602860248201527f4a65616e436f64653a207075626c69632073616c65206973206e6f74207374616044820152671c9d1959081e595d60c21b6064820152608401610b67565b33600090815260146020526040812054662386f26fc1000091600591906001600160401b038516611d4c60105490565b611d569190613af5565b90506001600160801b038316611d756001600160401b03871684613af5565b1115611dc65760405162461bcd60e51b815260206004820152602c6024820152600080516020613cf783398151915260448201526b616e203520746f6b656e732160a01b6064820152608401610b67565b600b811115611de75760405162461bcd60e51b8152600401610b679061392b565b34611dfb6001600160401b03871686613b43565b1115611e195760405162461bcd60e51b8152600401610b6790613819565b601154611e309086906001600160401b0316613b0d565b601180546001600160401b0319166001600160401b039290921691909117905560405133907f819f7e30541f2ed7e36c92ce039f5eb2d66b7dc094b33f416910e8fde56b80dc90611e849088908890613adc565b60405180910390a260016001600160401b038616600b81611ea460105490565b611eae9190613af5565b1415611ec2576015805460ff191660041790555b33600090815260146020526040902054611edd908290613af5565b33600090815260146020526040902055815b818111611f2357611f04601080546001019055565b611f1133610f4f60105490565b80611f1b81613be0565b915050611eef565b50506001600e55505050505050565b6001600160a01b03166000908152600b602052604090205490565b600d5460ff1615611f705760405162461bcd60e51b8152600401610b67906139a4565b600160155460ff166005811115611f8957611f89613c3b565b14611fce5760405162461bcd60e51b8152602060048201526015602482015274149859999b19481cd85b19481a185cc8195b991959605a1b6044820152606401610b67565b6000612017611fde3360016129dc565b848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250612d5a92505050565b9050806120835760405162461bcd60e51b815260206004820152603460248201527f61646472657373206e6f74207665726966696564206f6e2074686520726166666044820152731b19481dda5b9b995c9cc81dda1a5d195b1a5cdd60621b6064820152608401610b67565b6011546120a1908590600160401b90046001600160401b0316613b0d565b6001600160401b0316600210156121055760405162461bcd60e51b81526020600482015260346024820152600080516020613cd7833981519152604482015273081c9859999b19481cdd5c1c1b1e481b1a5b5a5d60621b6064820152608401610b67565b33600090815260126020526040812054662386f26fc1000091600b916001916001600160401b03891661213760105490565b6121419190613af5565b9050838111156121635760405162461bcd60e51b8152600401610b6790613a03565b826121776001600160401b038b1684613af5565b11156121d35760405162461bcd60e51b815260206004820152602560248201527f746f6b656e73206d696e7465642077696c6c20676f206f7665722075736572206044820152641b1a5b5a5d60da1b6064820152608401610b67565b346121e76001600160401b038b1687613b43565b11156122055760405162461bcd60e51b8152600401610b6790613819565b601154612223908a90600160401b90046001600160401b0316613b0d565b601160086101000a8154816001600160401b0302191690836001600160401b03160217905550336001600160a01b03167fa89d90717541d28ff38ee3d6b1ac68792fc5daddd10683f72ba9f000d6812e288a87604051612284929190613adc565b60405180910390a2336000908152601260205260409020546122b0906001600160401b038b1690613af5565b336000908152601260205260408120919091555b896001600160401b0316811015612302576122e3601080546001019055565b6122f033610f4f60105490565b806122fa81613be0565b9150506122c4565b50505050505050505050565b600033612319611982565b6001600160a01b03161461233f5760405162461bcd60e51b8152600401610b67906139ce565b601580546002919060ff1916600183611a00565b60003361235e611982565b6001600160a01b0316146123845760405162461bcd60e51b8152600401610b67906139ce565b601580546003919060ff1916600183611a00565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b336123cf611982565b6001600160a01b0316146123f55760405162461bcd60e51b8152600401610b67906139ce565b80516117d390601a9060208401906132cd565b33612411611982565b6001600160a01b0316146124375760405162461bcd60e51b8152600401610b67906139ce565b6001600160a01b03811661249c5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610b67565b6124a581612a2d565b50565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906124fa826117d7565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6006546001600160a01b0384166000908152600860205260408120549091839161255d9086613b43565b6125679190613b2f565b6125719190613b62565b949350505050565b804710156125c95760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610b67565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612616576040519150601f19603f3d011682016040523d82523d6000602084013e61261b565b606091505b5050905080610d265760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c20726044820152791958da5c1a595b9d081b585e481a185d99481c995d995c9d195960321b6064820152608401610b67565b600061269a826124a8565b6126fb5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610b67565b6000612706836117d7565b9050806001600160a01b0316846001600160a01b031614806127415750836001600160a01b031661273684610aff565b6001600160a01b0316145b8061257157506125718185612398565b826001600160a01b0316612764826117d7565b6001600160a01b0316146127cc5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610b67565b6001600160a01b03821661282e5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610b67565b6128396000826124c5565b6001600160a01b0383166000908152600360205260408120805460019290612862908490613b62565b90915550506001600160a01b0382166000908152600360205260408120805460019290612890908490613af5565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b038681169182179092559151849391871691600080516020613cb783398151915291a4505050565b6117d3828260405180602001604052806000815250612d69565b600d5460ff166129425760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610b67565b600d805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b60405161297c9190613774565b60405180910390a1565b610d268363a9059cbb60e01b84846040516024016129a5929190613788565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612d9c565b6040516001600160601b0319606084901b1660208201526034810182905260009060540160405160208183030381529060405280519060200120905092915050565b6000611bc382601c5485612e6e565b600d80546001600160a01b03838116610100818102610100600160a81b031985161790945560405193909204169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600d5460ff1615612aaa5760405162461bcd60e51b8152600401610b67906139a4565b600d805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861296f3390565b816001600160a01b0316836001600160a01b03161415612b3d5760405162461bcd60e51b815260206004820152601960248201527822a9219b99189d1030b8383937bb32903a379031b0b63632b960391b6044820152606401610b67565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b612bb5848484612751565b612bc184848484612e84565b61178b5760405162461bcd60e51b8152600401610b679061384e565b606081612c015750506040805180820190915260018152600360fc1b602082015290565b60408051606480825260a082019092526000908260208201818036833701905050905060005b8415612c91576000612c3a600a87613bfb565b9050612c47600a87613b2f565b9550612c54816030613af5565b60f81b8383612c6281613be0565b945081518110612c7457612c74613c51565b60200101906001600160f81b031916908160001a90535050612c27565b6000816001600160401b03811115612cab57612cab613c67565b6040519080825280601f01601f191660200182016040528015612cd5576020820181803683370190505b50905060005b82811015612d50578381612cf0600186613b62565b612cfa9190613b62565b81518110612d0a57612d0a613c51565b602001015160f81c60f81b828281518110612d2757612d27613c51565b60200101906001600160f81b031916908160001a90535080612d4881613be0565b915050612cdb565b5095945050505050565b6000611bc382601b5485612e6e565b612d738383612f91565b612d806000848484612e84565b610d265760405162461bcd60e51b8152600401610b679061384e565b6000612df1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166130b19092919063ffffffff16565b805190915015610d265780806020019051810190612e0f9190613567565b610d265760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610b67565b600082612e7b85846130c0565b14949350505050565b60006001600160a01b0384163b15612f8657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612ec89033908990889088906004016137a1565b602060405180830381600087803b158015612ee257600080fd5b505af1925050508015612f12575060408051601f3d908101601f19168201909252612f0f918101906135ba565b60015b612f6c573d808015612f40576040519150601f19603f3d011682016040523d82523d6000602084013e612f45565b606091505b508051612f645760405162461bcd60e51b8152600401610b679061384e565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612571565b506001949350505050565b6001600160a01b038216612fe75760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610b67565b612ff0816124a8565b1561303c5760405162461bcd60e51b815260206004820152601c60248201527b115490cdcc8c4e881d1bdad95b88185b1c9958591e481b5a5b9d195960221b6044820152606401610b67565b6001600160a01b0382166000908152600360205260408120805460019290613065908490613af5565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386169081179091559051839290600080516020613cb7833981519152908290a45050565b6060612571848460008561316c565b600081815b84518110156131645760008582815181106130e2576130e2613c51565b60200260200101519050808311613124576040805160208101859052908101829052606001604051602081830303815290604052805190602001209250613151565b60408051602081018390529081018490526060016040516020818303038152906040528051906020012092505b508061315c81613be0565b9150506130c5565b509392505050565b6060824710156131cd5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610b67565b843b61321b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610b67565b600080866001600160a01b031685876040516132379190613729565b60006040518083038185875af1925050503d8060008114613274576040519150601f19603f3d011682016040523d82523d6000602084013e613279565b606091505b5091509150613289828286613294565b979650505050505050565b606083156132a3575081611bc3565b8251156132b35782518084602001fd5b8160405162461bcd60e51b8152600401610b679190613806565b8280546132d990613ba5565b90600052602060002090601f0160209004810192826132fb5760008555613341565b82601f1061331457805160ff1916838001178555613341565b82800160010185558215613341579182015b82811115613341578251825591602001919060010190613326565b5061334d929150613351565b5090565b5b8082111561334d5760008155600101613352565b60006001600160401b038084111561338057613380613c67565b604051601f8501601f19908116603f011681019082821181831017156133a8576133a8613c67565b816040528093508581528686860111156133c157600080fd5b858560208301376000602087830101525050509392505050565b80356001600160401b03811681146133f257600080fd5b919050565b60006020828403121561340957600080fd5b8135611bc381613c7d565b6000806040838503121561342757600080fd5b823561343281613c7d565b9150602083013561344281613c7d565b809150509250929050565b60008060006060848603121561346257600080fd5b833561346d81613c7d565b9250602084013561347d81613c7d565b929592945050506040919091013590565b600080600080608085870312156134a457600080fd5b84356134af81613c7d565b935060208501356134bf81613c7d565b92506040850135915060608501356001600160401b038111156134e157600080fd5b8501601f810187136134f257600080fd5b61350187823560208401613366565b91505092959194509250565b6000806040838503121561352057600080fd5b823561352b81613c7d565b9150602083013561344281613c92565b6000806040838503121561354e57600080fd5b823561355981613c7d565b946020939093013593505050565b60006020828403121561357957600080fd5b8151611bc381613c92565b60006020828403121561359657600080fd5b5035919050565b6000602082840312156135af57600080fd5b8135611bc381613ca0565b6000602082840312156135cc57600080fd5b8151611bc381613ca0565b6000602082840312156135e957600080fd5b81356001600160401b038111156135ff57600080fd5b8201601f8101841361361057600080fd5b61257184823560208401613366565b60006020828403121561363157600080fd5b5051919050565b6000806040838503121561364b57600080fd5b82359150602083013561344281613c7d565b60006020828403121561366f57600080fd5b611bc3826133db565b60008060006040848603121561368d57600080fd5b613696846133db565b925060208401356001600160401b03808211156136b257600080fd5b818601915086601f8301126136c657600080fd5b8135818111156136d557600080fd5b8760208260051b85010111156136ea57600080fd5b6020830194508093505050509250925092565b60008151808452613715816020860160208601613b79565b601f01601f19169290920160200192915050565b6000825161373b818460208701613b79565b9190910192915050565b60008351613757818460208801613b79565b83519083019061376b818360208801613b79565b01949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906137d4908301846136fd565b9695505050505050565b602081016006831061380057634e487b7160e01b600052602160045260246000fd5b91905290565b602081526000611bc360208301846136fd565b6020808252601b908201527a4a65616e436f64653a20496e737566696369656e742066756e647360281b604082015260600190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526025908201527f4a65616e436f64653a206e65656420746f206d696e74206174206c65617374206040820152640c4813919560da1b606082015260800190565b60208082526026908201527f5061796d656e7453706c69747465723a206163636f756e7420686173206e6f2060408201526573686172657360d01b606082015260800190565b6020808252601490820152734a65616e436f64653a20536f6c64206f7574202160601b604082015260600190565b6020808252602b908201527f5061796d656e7453706c69747465723a206163636f756e74206973206e6f742060408201526a191d59481c185e5b595b9d60aa1b606082015260800190565b60208082526010908201526f14185d5cd8589b194e881c185d5cd95960821b604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252600a9082015269536f6c64206f7574202160b01b604082015260600190565b6020808252601390820152724a65616e436f64653a20534f4c44204f55542160681b604082015260600190565b6020808252601f908201527f6e65656420746f206d696e74206174206c65617374206f6e6520746f6b656e00604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6001600160401b03929092168252602082015260400190565b60008219821115613b0857613b08613c0f565b500190565b60006001600160401b0382811684821680830382111561376b5761376b613c0f565b600082613b3e57613b3e613c25565b500490565b6000816000190483118215151615613b5d57613b5d613c0f565b500290565b600082821015613b7457613b74613c0f565b500390565b60005b83811015613b94578181015183820152602001613b7c565b8381111561178b5750506000910152565b600181811c90821680613bb957607f821691505b60208210811415613bda57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415613bf457613bf4613c0f565b5060010190565b600082613c0a57613c0a613c25565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146124a557600080fd5b80151581146124a557600080fd5b6001600160e01b0319811681146124a557600080fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef63616e6e6f74206d696e7420746f6b656e732e2077696c6c20676f206f7665724a65616e436f64653a20596f752063616e2774206d696e74206d6f7265207468a2646970667358221220f31a12db5bc7c812d4bb9bdecea0ebd10f6415f1762981d27845427359b4b95864736f6c63430008070033",
    "deployedBytecode": "0x6080604052600436106102b65760003560e01c80630189c66c146102fb57806301ffc9a71461033f57806306fdde031461036f578063081812fc14610391578063081c8c44146103be578063095ea7b3146103d357806317e7f295146103f557806318160ddd1461041e57806319165587146104335780631ea639011461045357806323b872dd146104685780632fc66c1a1461048857806332cb6b0c146104af5780633a98ef39146104c45780633c0a1d09146104d95780633f4ba83a146104f9578063406072a91461050e57806342842e0e1461052e578063440bc7f31461054e57806348b750441461056e578063490772231461058e5780634c261247146105a157806351830227146105c157806355e39d9b146105db57806355f804b3146105fb5780635c975abb1461061b5780636352211e146106335780636c0360eb146106535780636e56539b1461066857806370a082311461067d578063715018a61461069d5780638456cb59146106b25780638b83209b146106c75780638d859f3e146106e75780638da5cb5b1461071a57806395d89b411461072f5780639852595c146107445780639939494b14610764578063a22cb46514610786578063a3344125146107a6578063a65e83f8146107c0578063b03a2340146107d5578063b88d4fde14610802578063c87b56dd14610822578063ce7c2ac214610842578063d17a18cd14610878578063d2eca8341461088e578063d3e46dce146108bb578063d63dd701146108e8578063d79779b2146108fb578063d82c7dcb1461091b578063dc61764a1461092e578063dc69591614610944578063e2298c7414610964578063e33b7de314610979578063e3bba1691461098e578063e985e9c5146109a3578063ee1e36bd146106e7578063f2c4ce1e146109c3578063f2fde38b146109e3578063f75d64a614610a0357600080fd5b366102f6577f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be77033346040516102ec929190613788565b60405180910390a1005b600080fd5b34801561030757600080fd5b5060115461032290600160801b90046001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b34801561034b57600080fd5b5061035f61035a36600461359d565b610a1b565b6040519015158152602001610336565b34801561037b57600080fd5b50610384610a6d565b6040516103369190613806565b34801561039d57600080fd5b506103b16103ac366004613584565b610aff565b6040516103369190613774565b3480156103ca57600080fd5b50610384610b8c565b3480156103df57600080fd5b506103f36103ee36600461353b565b610c1a565b005b34801561040157600080fd5b50610410662386f26fc1000081565b604051908152602001610336565b34801561042a57600080fd5b50610410610d2b565b34801561043f57600080fd5b506103f361044e3660046133f7565b610d37565b34801561045f57600080fd5b50610322600581565b34801561047457600080fd5b506103f361048336600461344d565b610e46565b34801561049457600080fd5b5060115461032290600160401b90046001600160401b031681565b3480156104bb57600080fd5b50610322600b81565b3480156104d057600080fd5b50600654610410565b3480156104e557600080fd5b506103f36104f4366004613638565b610e77565b34801561050557600080fd5b506103f3610f6d565b34801561051a57600080fd5b50610410610529366004613414565b610fa6565b34801561053a57600080fd5b506103f361054936600461344d565b610fd1565b34801561055a57600080fd5b506103f3610569366004613584565b610fec565b34801561057a57600080fd5b506103f3610589366004613414565b611020565b6103f361059c366004613678565b6111d6565b3480156105ad57600080fd5b506103f36105bc3660046135d7565b611633565b3480156105cd57600080fd5b5060185461035f9060ff1681565b3480156105e757600080fd5b506103f36105f636600461365d565b611686565b34801561060757600080fd5b506103f36106163660046135d7565b611791565b34801561062757600080fd5b50600d5460ff1661035f565b34801561063f57600080fd5b506103b161064e366004613584565b6117d7565b34801561065f57600080fd5b5061038461184e565b34801561067457600080fd5b50610322600181565b34801561068957600080fd5b506104106106983660046133f7565b61185b565b3480156106a957600080fd5b506103f36118e2565b3480156106be57600080fd5b506103f361191b565b3480156106d357600080fd5b506103b16106e2366004613584565b611952565b3480156106f357600080fd5b50610702662386f26fc1000081565b6040516001600160801b039091168152602001610336565b34801561072657600080fd5b506103b1611982565b34801561073b57600080fd5b50610384611996565b34801561075057600080fd5b5061041061075f3660046133f7565b6119a5565b34801561077057600080fd5b506107796119c0565b60405161033691906137de565b34801561079257600080fd5b506103f36107a136600461350d565b611a0f565b3480156107b257600080fd5b506015546107799060ff1681565b3480156107cc57600080fd5b50610322600281565b3480156107e157600080fd5b506104106107f03660046133f7565b60146020526000908152604090205481565b34801561080e57600080fd5b506103f361081d36600461348e565b611a1a565b34801561082e57600080fd5b5061038461083d366004613584565b611a4c565b34801561084e57600080fd5b5061041061085d3660046133f7565b6001600160a01b031660009081526008602052604090205490565b34801561088457600080fd5b50610410601c5481565b34801561089a57600080fd5b506104106108a93660046133f7565b60126020526000908152604090205481565b3480156108c757600080fd5b506104106108d63660046133f7565b60136020526000908152604090205481565b6103f36108f636600461365d565b611bca565b34801561090757600080fd5b506104106109163660046133f7565b611f32565b6103f3610929366004613678565b611f4d565b34801561093a57600080fd5b50610410601b5481565b34801561095057600080fd5b50601154610322906001600160401b031681565b34801561097057600080fd5b5061077961230e565b34801561098557600080fd5b50600754610410565b34801561099a57600080fd5b50610779612353565b3480156109af57600080fd5b5061035f6109be366004613414565b612398565b3480156109cf57600080fd5b506103f36109de3660046135d7565b6123c6565b3480156109ef57600080fd5b506103f36109fe3660046133f7565b612408565b348015610a0f57600080fd5b5060155460ff16610779565b60006001600160e01b031982166380ac58cd60e01b1480610a4c57506001600160e01b03198216635b5e139f60e01b145b80610a6757506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060008054610a7c90613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054610aa890613ba5565b8015610af55780601f10610aca57610100808354040283529160200191610af5565b820191906000526020600020905b815481529060010190602001808311610ad857829003601f168201915b5050505050905090565b6000610b0a826124a8565b610b705760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b601a8054610b9990613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054610bc590613ba5565b8015610c125780601f10610be757610100808354040283529160200191610c12565b820191906000526020600020905b815481529060010190602001808311610bf557829003601f168201915b505050505081565b6000610c25826117d7565b9050806001600160a01b0316836001600160a01b03161415610c935760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610b67565b336001600160a01b0382161480610caf5750610caf8133612398565b610d1c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776044820152771b995c881b9bdc88185c1c1c9bdd995908199bdc88185b1b60421b6064820152608401610b67565b610d2683836124c5565b505050565b600080610a6760105490565b6001600160a01b038116600090815260086020526040902054610d6c5760405162461bcd60e51b8152600401610b67906138e5565b6000610d7760075490565b610d819047613af5565b90506000610d988383610d93866119a5565b612533565b905080610db75760405162461bcd60e51b8152600401610b6790613959565b6001600160a01b03831660009081526009602052604081208054839290610ddf908490613af5565b925050819055508060076000828254610df89190613af5565b90915550610e0890508382612579565b7fdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b0568382604051610e39929190613788565b60405180910390a1505050565b610e50338261268f565b610e6c5760405162461bcd60e51b8152600401610b6790613a8b565b610d26838383612751565b33610e80611982565b6001600160a01b031614610ea65760405162461bcd60e51b8152600401610b67906139ce565b60008211610ec65760405162461bcd60e51b8152600401610b67906138a0565b600082610ed260105490565b610edc9190613af5565b9050600b811115610eff5760405162461bcd60e51b8152600401610b679061392b565b82600b81610f0c60105490565b610f169190613af5565b1415610f2a576015805460ff191660041790555b60015b818111610f6657610f42601080546001019055565b610f5484610f4f60105490565b6128df565b80610f5e81613be0565b915050610f2d565b5050505050565b33610f76611982565b6001600160a01b031614610f9c5760405162461bcd60e51b8152600401610b67906139ce565b610fa46128f9565b565b6001600160a01b039182166000908152600c6020908152604080832093909416825291909152205490565b610d2683838360405180602001604052806000815250611a1a565b33610ff5611982565b6001600160a01b03161461101b5760405162461bcd60e51b8152600401610b67906139ce565b601b55565b6001600160a01b0381166000908152600860205260409020546110555760405162461bcd60e51b8152600401610b67906138e5565b600061106083611f32565b6040516370a0823160e01b81526001600160a01b038516906370a082319061108c903090600401613774565b60206040518083038186803b1580156110a457600080fd5b505afa1580156110b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110dc919061361f565b6110e69190613af5565b905060006110f98383610d938787610fa6565b9050806111185760405162461bcd60e51b8152600401610b6790613959565b6001600160a01b038085166000908152600c602090815260408083209387168352929052908120805483929061114f908490613af5565b90915550506001600160a01b0384166000908152600b60205260408120805483929061117c908490613af5565b9091555061118d9050848483612986565b836001600160a01b03167f3be5b7a71e84ed12875d241991c70855ac5817d847039e17a9d895c1ceb0f18a84836040516111c8929190613788565b60405180910390a250505050565b600d5460ff16156111f95760405162461bcd60e51b8152600401610b67906139a4565b6000836001600160401b0316116112225760405162461bcd60e51b8152600401610b6790613a54565b600460155460ff16600581111561123b5761123b613c3b565b14156112595760405162461bcd60e51b8152600401610b6790613a27565b600260155460ff16600581111561127257611272613c3b565b146112d55760405162461bcd60e51b815260206004820152602d60248201527f4a65616e436f64653a20707269766174652073616c65206973206e6f7420737460448201526c6172746564207965742069696960981b6064820152608401610b67565b600061131e6112e53360016129dc565b848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250612a1e92505050565b9050806113885760405162461bcd60e51b815260206004820152603260248201527f61646472657373206e6f74207665726966696564206f6e207468652070726976604482015271185d19481cd85b19481dda1a5d195b1a5cdd60721b6064820152608401610b67565b6011546113a6908590600160801b90046001600160401b0316613b0d565b6001600160401b03166001101561140b5760405162461bcd60e51b81526020600482015260356024820152600080516020613cd7833981519152604482015274081c1c9a5d985d19481cdd5c1c1b1e481b1a5b5a5d605a1b6064820152608401610b67565b33600090815260136020526040812054662386f26fc1000091600191906001600160401b03881661143b60105490565b6114459190613af5565b90506001600160801b0383166114646001600160401b038a1684613af5565b11156114b55760405162461bcd60e51b815260206004820152602c6024820152600080516020613cf783398151915260448201526b616e203120746f6b656e732160a01b6064820152608401610b67565b600b8111156114d65760405162461bcd60e51b8152600401610b6790613a03565b346114ea6001600160401b038a1686613b43565b11156115085760405162461bcd60e51b8152600401610b6790613819565b601154611526908990600160801b90046001600160401b0316613b0d565b601160106101000a8154816001600160401b0302191690836001600160401b03160217905550336001600160a01b03167f5a9bb1a07cf4b32f75aadb39ccc14dfdc985cb16bdddd078a7959ee819258cf48986604051611587929190613adc565b60405180910390a260016001600160401b038916600b816115a760105490565b6115b19190613af5565b14156115c5576015805460ff191660041790555b336000908152601360205260409020546115e0908290613af5565b33600090815260136020526040902055815b81811161162657611607601080546001019055565b61161433610f4f60105490565b8061161e81613be0565b9150506115f2565b5050505050505050505050565b3361163c611982565b6001600160a01b0316146116625760405162461bcd60e51b8152600401610b67906139ce565b80516116759060199060208401906132cd565b50506018805460ff19166001179055565b3361168f611982565b6001600160a01b0316146116b55760405162461bcd60e51b8152600401610b67906139ce565b6000816001600160401b0316116116de5760405162461bcd60e51b8152600401610b67906138a0565b6000816001600160401b03166116f360105490565b6116fd9190613af5565b9050600b8111156117205760405162461bcd60e51b8152600401610b679061392b565b6001600160401b038216600b8161173660105490565b6117409190613af5565b1415611754576015805460ff191660041790555b60015b81811161178b5761176c601080546001019055565b61177933610f4f60105490565b8061178381613be0565b915050611757565b50505050565b3361179a611982565b6001600160a01b0316146117c05760405162461bcd60e51b8152600401610b67906139ce565b80516117d39060199060208401906132cd565b5050565b6000818152600260205260408120546001600160a01b031680610a675760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610b67565b60198054610b9990613ba5565b60006001600160a01b0382166118c65760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610b67565b506001600160a01b031660009081526003602052604090205490565b336118eb611982565b6001600160a01b0316146119115760405162461bcd60e51b8152600401610b67906139ce565b610fa46000612a2d565b33611924611982565b6001600160a01b03161461194a5760405162461bcd60e51b8152600401610b67906139ce565b610fa4612a87565b6000600a828154811061196757611967613c51565b6000918252602090912001546001600160a01b031692915050565b600d5461010090046001600160a01b031690565b606060018054610a7c90613ba5565b6001600160a01b031660009081526009602052604090205490565b6000336119cb611982565b6001600160a01b0316146119f15760405162461bcd60e51b8152600401610b67906139ce565b601580546001919060ff191682805b02179055505060155460ff1690565b6117d3338383612adf565b611a24338361268f565b611a405760405162461bcd60e51b8152600401610b6790613a8b565b61178b84848484612baa565b60185460609060ff16611aeb57601a8054611a6690613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054611a9290613ba5565b8015611adf5780601f10611ab457610100808354040283529160200191611adf565b820191906000526020600020905b815481529060010190602001808311611ac257829003601f168201915b50505050509050919050565b600060198054611afa90613ba5565b80601f0160208091040260200160405190810160405280929190818152602001828054611b2690613ba5565b8015611b735780601f10611b4857610100808354040283529160200191611b73565b820191906000526020600020905b815481529060010190602001808311611b5657829003601f168201915b505050505090506000815111611b985760405180602001604052806000815250611bc3565b80611ba284612bdd565b604051602001611bb3929190613745565b6040516020818303038152906040525b9392505050565b6002600e541415611c1d5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610b67565b6002600e55600d5460ff1615611c455760405162461bcd60e51b8152600401610b67906139a4565b6000816001600160401b031611611c6e5760405162461bcd60e51b8152600401610b6790613a54565b600460155460ff166005811115611c8757611c87613c3b565b1415611ca55760405162461bcd60e51b8152600401610b6790613a27565b600360155460ff166005811115611cbe57611cbe613c3b565b14611d1c5760405162461bcd60e51b815260206004820152602860248201527f4a65616e436f64653a207075626c69632073616c65206973206e6f74207374616044820152671c9d1959081e595d60c21b6064820152608401610b67565b33600090815260146020526040812054662386f26fc1000091600591906001600160401b038516611d4c60105490565b611d569190613af5565b90506001600160801b038316611d756001600160401b03871684613af5565b1115611dc65760405162461bcd60e51b815260206004820152602c6024820152600080516020613cf783398151915260448201526b616e203520746f6b656e732160a01b6064820152608401610b67565b600b811115611de75760405162461bcd60e51b8152600401610b679061392b565b34611dfb6001600160401b03871686613b43565b1115611e195760405162461bcd60e51b8152600401610b6790613819565b601154611e309086906001600160401b0316613b0d565b601180546001600160401b0319166001600160401b039290921691909117905560405133907f819f7e30541f2ed7e36c92ce039f5eb2d66b7dc094b33f416910e8fde56b80dc90611e849088908890613adc565b60405180910390a260016001600160401b038616600b81611ea460105490565b611eae9190613af5565b1415611ec2576015805460ff191660041790555b33600090815260146020526040902054611edd908290613af5565b33600090815260146020526040902055815b818111611f2357611f04601080546001019055565b611f1133610f4f60105490565b80611f1b81613be0565b915050611eef565b50506001600e55505050505050565b6001600160a01b03166000908152600b602052604090205490565b600d5460ff1615611f705760405162461bcd60e51b8152600401610b67906139a4565b600160155460ff166005811115611f8957611f89613c3b565b14611fce5760405162461bcd60e51b8152602060048201526015602482015274149859999b19481cd85b19481a185cc8195b991959605a1b6044820152606401610b67565b6000612017611fde3360016129dc565b848480806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250612d5a92505050565b9050806120835760405162461bcd60e51b815260206004820152603460248201527f61646472657373206e6f74207665726966696564206f6e2074686520726166666044820152731b19481dda5b9b995c9cc81dda1a5d195b1a5cdd60621b6064820152608401610b67565b6011546120a1908590600160401b90046001600160401b0316613b0d565b6001600160401b0316600210156121055760405162461bcd60e51b81526020600482015260346024820152600080516020613cd7833981519152604482015273081c9859999b19481cdd5c1c1b1e481b1a5b5a5d60621b6064820152608401610b67565b33600090815260126020526040812054662386f26fc1000091600b916001916001600160401b03891661213760105490565b6121419190613af5565b9050838111156121635760405162461bcd60e51b8152600401610b6790613a03565b826121776001600160401b038b1684613af5565b11156121d35760405162461bcd60e51b815260206004820152602560248201527f746f6b656e73206d696e7465642077696c6c20676f206f7665722075736572206044820152641b1a5b5a5d60da1b6064820152608401610b67565b346121e76001600160401b038b1687613b43565b11156122055760405162461bcd60e51b8152600401610b6790613819565b601154612223908a90600160401b90046001600160401b0316613b0d565b601160086101000a8154816001600160401b0302191690836001600160401b03160217905550336001600160a01b03167fa89d90717541d28ff38ee3d6b1ac68792fc5daddd10683f72ba9f000d6812e288a87604051612284929190613adc565b60405180910390a2336000908152601260205260409020546122b0906001600160401b038b1690613af5565b336000908152601260205260408120919091555b896001600160401b0316811015612302576122e3601080546001019055565b6122f033610f4f60105490565b806122fa81613be0565b9150506122c4565b50505050505050505050565b600033612319611982565b6001600160a01b03161461233f5760405162461bcd60e51b8152600401610b67906139ce565b601580546002919060ff1916600183611a00565b60003361235e611982565b6001600160a01b0316146123845760405162461bcd60e51b8152600401610b67906139ce565b601580546003919060ff1916600183611a00565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b336123cf611982565b6001600160a01b0316146123f55760405162461bcd60e51b8152600401610b67906139ce565b80516117d390601a9060208401906132cd565b33612411611982565b6001600160a01b0316146124375760405162461bcd60e51b8152600401610b67906139ce565b6001600160a01b03811661249c5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610b67565b6124a581612a2d565b50565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906124fa826117d7565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6006546001600160a01b0384166000908152600860205260408120549091839161255d9086613b43565b6125679190613b2f565b6125719190613b62565b949350505050565b804710156125c95760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610b67565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612616576040519150601f19603f3d011682016040523d82523d6000602084013e61261b565b606091505b5050905080610d265760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c20726044820152791958da5c1a595b9d081b585e481a185d99481c995d995c9d195960321b6064820152608401610b67565b600061269a826124a8565b6126fb5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610b67565b6000612706836117d7565b9050806001600160a01b0316846001600160a01b031614806127415750836001600160a01b031661273684610aff565b6001600160a01b0316145b8061257157506125718185612398565b826001600160a01b0316612764826117d7565b6001600160a01b0316146127cc5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610b67565b6001600160a01b03821661282e5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610b67565b6128396000826124c5565b6001600160a01b0383166000908152600360205260408120805460019290612862908490613b62565b90915550506001600160a01b0382166000908152600360205260408120805460019290612890908490613af5565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b038681169182179092559151849391871691600080516020613cb783398151915291a4505050565b6117d3828260405180602001604052806000815250612d69565b600d5460ff166129425760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610b67565b600d805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b60405161297c9190613774565b60405180910390a1565b610d268363a9059cbb60e01b84846040516024016129a5929190613788565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612d9c565b6040516001600160601b0319606084901b1660208201526034810182905260009060540160405160208183030381529060405280519060200120905092915050565b6000611bc382601c5485612e6e565b600d80546001600160a01b03838116610100818102610100600160a81b031985161790945560405193909204169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600d5460ff1615612aaa5760405162461bcd60e51b8152600401610b67906139a4565b600d805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861296f3390565b816001600160a01b0316836001600160a01b03161415612b3d5760405162461bcd60e51b815260206004820152601960248201527822a9219b99189d1030b8383937bb32903a379031b0b63632b960391b6044820152606401610b67565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b612bb5848484612751565b612bc184848484612e84565b61178b5760405162461bcd60e51b8152600401610b679061384e565b606081612c015750506040805180820190915260018152600360fc1b602082015290565b60408051606480825260a082019092526000908260208201818036833701905050905060005b8415612c91576000612c3a600a87613bfb565b9050612c47600a87613b2f565b9550612c54816030613af5565b60f81b8383612c6281613be0565b945081518110612c7457612c74613c51565b60200101906001600160f81b031916908160001a90535050612c27565b6000816001600160401b03811115612cab57612cab613c67565b6040519080825280601f01601f191660200182016040528015612cd5576020820181803683370190505b50905060005b82811015612d50578381612cf0600186613b62565b612cfa9190613b62565b81518110612d0a57612d0a613c51565b602001015160f81c60f81b828281518110612d2757612d27613c51565b60200101906001600160f81b031916908160001a90535080612d4881613be0565b915050612cdb565b5095945050505050565b6000611bc382601b5485612e6e565b612d738383612f91565b612d806000848484612e84565b610d265760405162461bcd60e51b8152600401610b679061384e565b6000612df1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166130b19092919063ffffffff16565b805190915015610d265780806020019051810190612e0f9190613567565b610d265760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610b67565b600082612e7b85846130c0565b14949350505050565b60006001600160a01b0384163b15612f8657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612ec89033908990889088906004016137a1565b602060405180830381600087803b158015612ee257600080fd5b505af1925050508015612f12575060408051601f3d908101601f19168201909252612f0f918101906135ba565b60015b612f6c573d808015612f40576040519150601f19603f3d011682016040523d82523d6000602084013e612f45565b606091505b508051612f645760405162461bcd60e51b8152600401610b679061384e565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612571565b506001949350505050565b6001600160a01b038216612fe75760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610b67565b612ff0816124a8565b1561303c5760405162461bcd60e51b815260206004820152601c60248201527b115490cdcc8c4e881d1bdad95b88185b1c9958591e481b5a5b9d195960221b6044820152606401610b67565b6001600160a01b0382166000908152600360205260408120805460019290613065908490613af5565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386169081179091559051839290600080516020613cb7833981519152908290a45050565b6060612571848460008561316c565b600081815b84518110156131645760008582815181106130e2576130e2613c51565b60200260200101519050808311613124576040805160208101859052908101829052606001604051602081830303815290604052805190602001209250613151565b60408051602081018390529081018490526060016040516020818303038152906040528051906020012092505b508061315c81613be0565b9150506130c5565b509392505050565b6060824710156131cd5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610b67565b843b61321b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610b67565b600080866001600160a01b031685876040516132379190613729565b60006040518083038185875af1925050503d8060008114613274576040519150601f19603f3d011682016040523d82523d6000602084013e613279565b606091505b5091509150613289828286613294565b979650505050505050565b606083156132a3575081611bc3565b8251156132b35782518084602001fd5b8160405162461bcd60e51b8152600401610b679190613806565b8280546132d990613ba5565b90600052602060002090601f0160209004810192826132fb5760008555613341565b82601f1061331457805160ff1916838001178555613341565b82800160010185558215613341579182015b82811115613341578251825591602001919060010190613326565b5061334d929150613351565b5090565b5b8082111561334d5760008155600101613352565b60006001600160401b038084111561338057613380613c67565b604051601f8501601f19908116603f011681019082821181831017156133a8576133a8613c67565b816040528093508581528686860111156133c157600080fd5b858560208301376000602087830101525050509392505050565b80356001600160401b03811681146133f257600080fd5b919050565b60006020828403121561340957600080fd5b8135611bc381613c7d565b6000806040838503121561342757600080fd5b823561343281613c7d565b9150602083013561344281613c7d565b809150509250929050565b60008060006060848603121561346257600080fd5b833561346d81613c7d565b9250602084013561347d81613c7d565b929592945050506040919091013590565b600080600080608085870312156134a457600080fd5b84356134af81613c7d565b935060208501356134bf81613c7d565b92506040850135915060608501356001600160401b038111156134e157600080fd5b8501601f810187136134f257600080fd5b61350187823560208401613366565b91505092959194509250565b6000806040838503121561352057600080fd5b823561352b81613c7d565b9150602083013561344281613c92565b6000806040838503121561354e57600080fd5b823561355981613c7d565b946020939093013593505050565b60006020828403121561357957600080fd5b8151611bc381613c92565b60006020828403121561359657600080fd5b5035919050565b6000602082840312156135af57600080fd5b8135611bc381613ca0565b6000602082840312156135cc57600080fd5b8151611bc381613ca0565b6000602082840312156135e957600080fd5b81356001600160401b038111156135ff57600080fd5b8201601f8101841361361057600080fd5b61257184823560208401613366565b60006020828403121561363157600080fd5b5051919050565b6000806040838503121561364b57600080fd5b82359150602083013561344281613c7d565b60006020828403121561366f57600080fd5b611bc3826133db565b60008060006040848603121561368d57600080fd5b613696846133db565b925060208401356001600160401b03808211156136b257600080fd5b818601915086601f8301126136c657600080fd5b8135818111156136d557600080fd5b8760208260051b85010111156136ea57600080fd5b6020830194508093505050509250925092565b60008151808452613715816020860160208601613b79565b601f01601f19169290920160200192915050565b6000825161373b818460208701613b79565b9190910192915050565b60008351613757818460208801613b79565b83519083019061376b818360208801613b79565b01949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906137d4908301846136fd565b9695505050505050565b602081016006831061380057634e487b7160e01b600052602160045260246000fd5b91905290565b602081526000611bc360208301846136fd565b6020808252601b908201527a4a65616e436f64653a20496e737566696369656e742066756e647360281b604082015260600190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526025908201527f4a65616e436f64653a206e65656420746f206d696e74206174206c65617374206040820152640c4813919560da1b606082015260800190565b60208082526026908201527f5061796d656e7453706c69747465723a206163636f756e7420686173206e6f2060408201526573686172657360d01b606082015260800190565b6020808252601490820152734a65616e436f64653a20536f6c64206f7574202160601b604082015260600190565b6020808252602b908201527f5061796d656e7453706c69747465723a206163636f756e74206973206e6f742060408201526a191d59481c185e5b595b9d60aa1b606082015260800190565b60208082526010908201526f14185d5cd8589b194e881c185d5cd95960821b604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252600a9082015269536f6c64206f7574202160b01b604082015260600190565b6020808252601390820152724a65616e436f64653a20534f4c44204f55542160681b604082015260600190565b6020808252601f908201527f6e65656420746f206d696e74206174206c65617374206f6e6520746f6b656e00604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6001600160401b03929092168252602082015260400190565b60008219821115613b0857613b08613c0f565b500190565b60006001600160401b0382811684821680830382111561376b5761376b613c0f565b600082613b3e57613b3e613c25565b500490565b6000816000190483118215151615613b5d57613b5d613c0f565b500290565b600082821015613b7457613b74613c0f565b500390565b60005b83811015613b94578181015183820152602001613b7c565b8381111561178b5750506000910152565b600181811c90821680613bb957607f821691505b60208210811415613bda57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415613bf457613bf4613c0f565b5060010190565b600082613c0a57613c0a613c25565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146124a557600080fd5b80151581146124a557600080fd5b6001600160e01b0319811681146124a557600080fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef63616e6e6f74206d696e7420746f6b656e732e2077696c6c20676f206f7665724a65616e436f64653a20596f752063616e2774206d696e74206d6f7265207468a2646970667358221220f31a12db5bc7c812d4bb9bdecea0ebd10f6415f1762981d27845427359b4b95864736f6c63430008070033",
    "linkReferences": {},
    "deployedLinkReferences": {}
}


export class Titre {
}