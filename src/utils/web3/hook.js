import {ethers} from "ethers";
import RaffleAbi from "../../assets/abi/JeanCode.json";
import {toast} from "react-toastify";
import {toastThis} from "../navigation/toast"
import whitelist from "../../assets/merkle/oglist.json";

const contractAddress = process.env.CONTRACT_ADDRESS;

const toastParameters = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const WL = new Map();
whitelist.forEach((element) => {
    WL.set(element.address.toLowerCase(), element.proof);
});

export async function mint(amount, mintPrice) {
    if (window && window.ethereum && window.ethereum.isConnected()) {
        let response
        const mintWorkflow = "Private";
        if (mintWorkflow === "ogSales") {
            response = await mintOg(amount, WL, mintPrice)
        }
        if (mintWorkflow === "Private") {
            response = await mintPrivate(amount, WL, mintPrice);
        }
        console.log(response);
        return response;
    } else toastThis("Check you metamask")
}

export function metamaskIsConnected() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        return window.ethereum.isConnected()
    }
}

function getContract() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(" signer :", signer);
        const contract = new ethers.Contract(
            contractAddress,
            RaffleAbi.abi,
            signer
        );
        contract.connect(provider);

        return contract;
    } catch (error) {
        toastThis("Please install Metamask");
        throw ("Cant find Metamask error: ", error);
    }
}

export function isWhitheListed() {
    let address
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        address = window.ethereum.selectedAddress;
    } else {

        if (typeof window !== "undefined") {
            window.location.replace(
                "https://metamask.app.link/dapp/mint.meta-farmers.com/"
            );
        }
    }
    console.log("signer is ", address);
    console.log("contract is ", contractAddress);
    console.log(
        "signer is whitelisted :"
        , WL.has(address)
    );
    return WL.has(address);
}

export function getMetamask() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        window.location.replace(
            "https://metamask.app.link/dapp/mint.meta-farmers.com/"
        );
    }
}

export async function mintOg(amount, WL, mintPrice) {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const contract = getContract();
        const minterAddress = window.ethereum.selectedAddress;
        console.log("Contract Mint : ", contract);
        try {
            window.ethereum.on("error", (message, code) =>
                console.log(" Error on metamask: ", code, message)
            );
            console.log()
            isWhitheListed(minterAddress)
            const data = await contract.redeemRaffle(
                amount,
                WL.get(window.ethereum.selectedAddress),
                {
                    value: ethers.utils.parseEther((mintPrice * amount).toString()),
                }
            );
            console.log("contract data: ", data);
        } catch (error) {
            const message = metamaskErrorHandler(error);
            toast(message, toastParameters);
            console.log(error);
        }
    }
}

export async function mintPrivate(amount, WL) {
    //TODO tester le reaseau
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const contract = getContract();
        const mintPrice = ethers.utils.formatEther(await contract.WHITELIST_PRICE())
        const minterAddress = window.ethereum.selectedAddress;
        console.log(minterAddress)
        console.log("mint private with argument ", amount, mintPrice, await WL.get(minterAddress))
        console.log("Contract Mint : ", contract);
        try {
            window.ethereum.on("error", (message, code) =>
                console.log(" Error on metamask: ", code, message)
            );
            console.log("PRICE ", ethers.utils.formatEther(await contract.WHITELIST_PRICE()));
            const data = await contract.redeemPrivateSale(
                amount,
                WL.get(window.ethereum.selectedAddress),
                {
                    value: ethers.utils.parseEther((mintPrice * amount).toString()),
                }
            );
            console.log("contract data: ", data);
            console.log("transaction succeed :", data)
            //  if (data.hasOwnProperty("hash")) {
            //    window.location.replace(
            //      "https://rinkeby.etherscan.io/tx/" + data.hash
            //);
            // }
        } catch (error) {
            Sentry.captureException(error);
            console.log("I got this error on mint 🐛 🐛", error);
            const message = metamaskErrorHandler(error);
            toast(message, toastParameters);
        }
    }
}


const checkChain = () => {

    const {ethereum} = window;
    if (ethereum) {
        console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');

        window.ethereum
            .request({
                method: "wallet_switchEthereumChain",
                params: [{
                    chainId: '0x4'
                }]
            })
            .then((chain) => {
                console.log("Metamask switched to the good chain " + chain);
            });

    }
}

export async function loginToMetaMask(setAddress) {
    try {
        const {ethereum} = window;
        if (!ethereum) {
            toast(" Please install Metamask");
            window.location.replace(
                "https://metamask.app.link/dapp/mint.meta-farmers.com/"
            );
            return ""
        }
        //checkChain()
        ethereum.on("accountsChanged", function (accounts) {
            setAddress(window.ethereum.selectedAddress);
            const message = "new address " + window.ethereum.selectedAddress;
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            window.location.reload();
        });
        ethereum.on("message", function (message) {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });

        const metamaskAdresses = await window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
        setAddress(metamaskAdresses[0])

    } catch (error) {
        if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("Please connect to MetaMask.");
            const message = "Please connect to MetaMask.";
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            const message = error.message;
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(error);
            throw error;
        }
    }
};

const chainIdtoName = (chainId) => {
    switch (chainId) {
        case 1:
            return "Mainnet";
        case 3:
            return "Ropsten";
        case 4:
            return "Rinkeby";
        case 42:
            return "Kovan";
        case 5:
            return "Goerli";
        default:
            return "unknown";
    }
};


function metamaskErrorHandler(error) {
    let message;
    if (error.code === 4001) {
        message = " You have rejected the transaction";
        return message;
    }
    if (error.code === -32002) {
        console.log("Error 🐛 : Action already asked");
        message = "Please check you metamask";
        return message;
    }
    if (error.code === "UNSUPPORTED_OPERATION") {
        message = "Check your metamask";
        return message;
    }
    console.log("", error);
    if (error.hasOwnProperty("error") && error.error.hasOwnProperty("code")) {
        if (error.error.code) {
            if (error.error.code === -32000) {
                console.log("insufficient funds");
                message = "insufficient funds";
                return message;
            }
            if (error.error.code === -32002) {
                console.log("Error 🐛 : Action already asked");
                message = "Please check you metamask";
                return message;
            }
            if (error.error.code === -32603) {
                if (
                    error.error.message === "execution reverted: Raffle sale has ended"
                ) {
                    message = "Raffle sale has ended";
                    return message;
                }
                if (
                    error.error.message === "execution reverted: Meta-Farmers: Insuficient funds"
                ) {
                    message = "Insuficient funds";
                    return message;
                }
                message = "You have minted too much token";
                return message;
            }
        }
    }
    return error;
}
