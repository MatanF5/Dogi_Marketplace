import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6 color text-blue-200 bg-neutral-700">
        <p className=" text-4xl font-bold ">Dogi MarketPlace</p>
        <div className="flex mt-4 justify-center space-x-20">
          <Link href="/">
          <a className="mr-4 text-blue-200 font-bold py-2 px-4 text-2xl bg-transparent rounded-full btn hover:bg-blue-200 hover:text-white">
              Home
            </a>
          </Link>
         
          <Link href="/create-nft">
            <a className="mr-6 text-blue-200 font-bold py-2 px-4 text-2xl bg-transparent rounded-full btn hover:bg-blue-200 hover:text-white">
            Create NFT
            </a>
          </Link>
          <Link href="/my-NFT">
          <a className="mr-6 text-blue-200 font-bold py-2 px-4 text-2xl bg-transparent rounded-full btn hover:bg-blue-200 hover:text-white">
              My NFT
            </a>
          </Link>
          <Link href="/transactions-dashboard">
          <a className="mr-6 text-blue-200 font-bold py-2 px-4 text-2xl bg-transparent rounded-full btn hover:bg-blue-200 hover:text-white">
              View Transactions
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace