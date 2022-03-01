import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarketPlace from "../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json";

export default function transactionsDashBoard() {
  const [NFTS, setNFTS] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadState, setLoadState] = useState("not-loaded");
  useEffect(() => {
    loadNFTS();
  }, []);
  async function loadNFTS() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketPlace.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNFTS(items);
    setLoadState("loaded");
  }
  if (loadState === "loaded" && !NFTS.length)
    return <h1 className="py-10 px-20 text-3xl">No NFT Bought or Sold</h1>;
  return (
    <div className = "bg-red-700">
      <div className="p-4">
        <h2 className="text-2xl py-2 text-blue-300">NFT Sold</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {NFTS.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 text-blue-300">
                <p className="text-2xl font-bold ">Price - {nft.price} Eth</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {Boolean(sold.length) && (
          <div>
            <h2 className="text-2xl py-2">NFT sold</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {sold.map((nft, i) => (
                <div
                  key={i}
                  className="border shadow rounded-xl overflow-hidden"
                >
                  <img src={nft.image} className="rounded" />
                  <div className="p-4 bg-slate-400">
                    <p className="text-2xl font-bold text-blue-300">
                      Price - {nft.price} Eth
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
