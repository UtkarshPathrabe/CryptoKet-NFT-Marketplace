import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components';
import images from '../assets';
import { NFTContext } from '../context/NFTContext';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [isLoading, setIsLoading] = useState(true);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchNFTs()
      .then((items) => {
        const sortedNfts = [...items];
        sortedNfts.sort((a, b) => b.tokenId - a.tokenId);
        setNfts(sortedNfts);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];
    switch (activeSelect) {
      case 'Price (low to high)': {
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      }
      case 'Price (high to low)': {
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      }
      case 'Recently added': {
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      }
      default:
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));
    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    setHideButtons(!(current?.scrollWidth >= parent?.offsetWidth));
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  }, []);

  const topCreators = getCreators(nftsCopy);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={(<>Discover, collect, and sell<br />extraordinary NFTs</>)}
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
        />
        { (isLoading) ? (
          <div className="flexStart min-h-screen">
            <Loader />
          </div>
        )
          : null }
        { (!isLoading && !nftsCopy.length)
          ? <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">No NFTs for sale!</h1>
          : (
            <>
              <div>
                <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Top Sellers</h1>
                <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
                  <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
                    {topCreators.slice(0, 10).map((creator, i) => (
                      <CreatorCard
                        key={creator.seller}
                        rank={i + 1}
                        creatorImage={images[`creator${i + 1}`]}
                        creatorName={shortenAddress(creator.seller)}
                        creatorEths={creator.sum}
                      />
                    ))}
                    {!hideButtons && (
                    <>
                      <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                        <Image src={images.left} layout="fill" objectFit="contain" alt="left-arrow" className={(theme === 'light') ? 'filter invert' : ''} />
                      </div>
                      <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                        <Image src={images.right} layout="fill" objectFit="contain" alt="right-arrow" className={(theme === 'light') ? 'filter invert' : ''} />
                      </div>
                    </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <div className="flexBetween mx-4 ms:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                  <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot NFTs</h1>
                  <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                    <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
                  </div>
                </div>
                <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                  { nfts.map((nft) => (<NFTCard key={nft.tokenId} nft={nft} />)) }
                </div>
              </div>
            </>
          ) }
      </div>
    </div>
  );
};

export default Home;
