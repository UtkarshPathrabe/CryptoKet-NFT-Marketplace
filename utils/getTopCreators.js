export const getCreators = (nfts) => {
  const creators = nfts.reduce((creatorObject, nft) => {
    // eslint-disable-next-line no-param-reassign
    (creatorObject[nft.seller] = creatorObject[nft.seller] || []).push(nft);
    return creatorObject;
  }, {});
  return Object.entries(creators).map((creator) => {
    const seller = creator[0];
    const sum = creator[1].map((item) => Number(item.price)).reduce((prev, value) => prev + value, 0);
    return ({ seller, sum });
  }).sort((a, b) => (b.sum - a.sum));
};
