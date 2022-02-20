import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { nftAddress, nftMarketAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarketPlace from '../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json'


export default function Home() {
  const [NFTS, setNFTS] = useState([])
  const [loadState, setLoadState] = useState('not-loaded')

  useEffect(() => {
    loadNFTS()
  }, [])

  async function loadNFTS() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, NFTMarketPlace.abi, provider)
    const data = await marketContract.fetchMarketItems()
    const items = await Promise.all(data.map(async i => {
      const tokenURI = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {  // Creating NFT item
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNFTS(items)
    setLoadState('Loaded')
  }

  async function buyNFT(NFT) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect() // Connecting
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() // Checking Signer 
    const contract = new ethers.Contract(nftMarketAddress, NFTMarketPlace.abi, signer)  // Reference of the contract
    const price = ethers.utils.parseUnits(NFT.price.toString(), 'ether') // Getting NFT price

    const transaction = await contract.createMarketSale(nftAddress, NFT.itemId, { value: price })
    await transaction.wait()
    loadNFTS()
  }
  if (loadState === 'Loaded' && !NFTS.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4 " style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4  ">
          {
            NFTS.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4 bg-blue-300">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold ">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden'  }}>
                    <p className="text-white">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-neutral-700">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="w-full bg-blue-300 text-white font-bold py-2 px-12 rounded" onClick={() => buyNFT(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
