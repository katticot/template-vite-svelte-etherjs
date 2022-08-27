import {ethers} from "ethers";
import {MetaFarmers} from "../../assets/types/MetaFarmers";
const ABI = require ("../../assets/abi/JeanCode.json")

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const provider = new ethers.providers.AlchemyProvider(process.env.ALCHEMY_NETWORK, process.env.ALCHEMY_API_KEY);

//const providerWS = new ethers.providers.AlchemyWebSocketProvider ("rinkeby","CfvEkiXhOqaySnuoeZONQchJI6A4wx9R");

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
enum Worflow{
    Before,
    Og,
    OgGhost,
    Private,
    Public,
    SoldOut
}

export interface FarmerState {
    address: string
    currentWorkflowName: string,
    currentWorflow : Worflow
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

export async function generateFarmerState(): Promise<FarmerState> {
    const contract = getContract() as MetaFarmers
    const address = contract.address
    const currentWorflow = (await contract.workflow())
    const currentWorkflowName = workflowToString(currentWorflow)
    let currentPrice: number
    if (currentWorflow == Worflow.Private) {
        currentPrice = (await contract.WHITELIST_PRICE()).toNumber()
    } else {
        currentPrice = (await contract.PRICE()).toNumber()
    }
    const isPaused = (await contract.paused())
    return {
        currentWorkflowName,
        currentPrice,
        isPaused,
        address,
        currentWorflow
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