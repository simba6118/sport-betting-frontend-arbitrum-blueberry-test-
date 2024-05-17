import logo from './logo.svg';
import './App.css';

import ConnectButton from './components/connectButton';
import { toast } from "react-toastify";
//for sepolia
// import ABI from "./assets/abi/abi.json";
// import TokenABI from "./assets/abi/tokenABI.json";
//for blueBerry
import ABI from "./assets/abi/blueBerryABI.json";
import TokenABI from "./assets/abi/blueberryTokenABI.json";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useConnect} from 'wagmi'
import * as React from 'react'
import { useEffect, useState } from 'react';
import BigNumber from "bignumber.js";

function App() {
  const [appr, setAppr] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract()
  const { data: ret } = useWaitForTransactionReceipt({
    hash,
  });
  // tokens for sepolia
  // const contract = "0x9f9F549B8aF4c87C8DB6D7B8F1B477e60B73Ab15";
  // const tokenContract = "0x45b3C87852be9519b6355E14cE7Da9E28726Ec43";

  // tokens for blueBerry
  const contract = "0x5576DbF77d9aEf072816d149630cd4820a6F1828";
  const tokenContract = "0x73C3cDd1418c3F17D54A81148387d93122802E72";
  const decimal = "100";
  const val = "0.1";

//   function ConnectButton() {
//   const { connect, connectors, isConnected } = useConnect();
//   const { data: accountData } = useAccount();

//   return (
//     <div>
//       {isConnected ? (
//         <div>Connected as {accountData?.address}</div>
//       ) : (
//         connectors.map((connector) => (
//           <button key={connector.id} onClick={() => connect({ connector })}>
//             Connect with {connector.name}
//           </button>
//         ))
//       )}
//     </div>
//   );
// }
 const formatNumber = (num) => {
  if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
  } else {
      return num.toFixed(2);
  }
}

  const distributions = [
    { receiver: '0xa6d1572e159a53b831E9de7894b72F6C9F2937E6', amount: '2' },
    { receiver: '0xDA24FC208f87078366dcF4837EAdC606E157D100', amount: '1' }
  ];

  // console log
  useEffect(() => {
    //
    // catch Betting Event from CoinFlip contract
    //
    if (ret) {
      console.log("transcation returned: ", ret);
      alert("wonderfull!!!!!");
      toast.success("wonderfull!!!!!");
      for (var i = 0; i < ret.logs.length; i++) {
        const log = ret.logs[i];
        if (log.address.localeCompare(contract.toLowerCase()) === 0) {
          let betAmount = Number(log.data.slice(0, 66));
          let result = Number(log.data.slice(67, 131));
          console.log(
            "------------simba catched amount: ",
            betAmount,
            " result : ",
            result
          );

          if (result === 1) {
            toast.success(
              "Congratulations! You won " + betAmount * 2 + " USD."
            );
            return;
          } else if (result === 0) {
            toast.error("Oops! You lost " + betAmount + " USD.");
            return;
          }
        }
      }
      toast.error(
        "Error!: Cannot decode return data.\nPlease check contract code if it contains event."
      );
    }
    else if (isConnected) {
      alert("Error!: Cannot decode return data.\nPlease check contract code if it contains event.");
      toast.error(
        "Error!: Cannot decode return data.\nPlease check contract code if it contains event."
      );
      console.log("transcation failed: ", ret);
    }
  }, [ret]);

  const { data: balance } = useReadContract({
    address: tokenContract,
    abi: TokenABI,
    functionName: "balanceOf",
    args: [address],
    chainId: 88153591557,
  });
  const { data: decimals } = useReadContract({
    address: tokenContract,
    abi: TokenABI,
    functionName: "decimals",
    chainId: 88153591557,
  });

  const withdrawAll = async() => { 
    writeContract({
      abi: ABI,
      address: contract,
      functionName: 'withdrawTokenAll',
    });
  } 
  const tokenTransfer = async () => {
    await writeContract({
      address: tokenContract,
      abi: TokenABI,
      functionName: 'transfer',
      args: [
        contract,
        BigNumber(val).multipliedBy(decimal),
      ],
    });
  }
  const withdraw = async () => {
    await writeContract({
      address: contract,
      abi: ABI,
      functionName: 'withdrawToken',
      args: [
        BigNumber(2).multipliedBy(decimal),
      ],
    });
  }
  const distribution = async() => { 
    writeContract({
      abi: ABI,
      address: contract,
      functionName: 'distributeToken',
      args: [
        distributions
      ],
      // chainId: 88153591557
    });
  } 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.{balance}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ConnectButton></ConnectButton>
        <div>
          <button onClick={distribution} >distribution</button>
          <button onClick={withdrawAll} >withdrawAll</button>
          <button onClick={withdraw} >withdraw</button>
          <button onClick={() => console.log("decimals: ", decimals)} >decimal</button>
          <button onClick={() => console.log("balance: ", formatNumber(parseFloat(BigNumber(balance).dividedBy(decimal))))} >balance</button>
        </div>
        <div>
          <button onClick={tokenTransfer} >buy result</button>
        </div>
        <div><p><span>{balance}</span></p></div>
      </header>
    </div>
  );
}

export default App;
