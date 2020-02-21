
const params = {
  LAST_POW_BLOCK: 182700, // 345600
  RAMP_TO_BLOCK: 0,
  LAST_SEESAW_BLOCK: 0
};

const avgBlockTime = 60; // 1 minutes (60 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 960

const blocksPerWeek = blocksPerDay * 7; // 6720

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 29220

const blocksPerYear = blocksPerDay * 365.25; // 350640

const mncoins = 10000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

  if (nHeight > params.LAST_SEESAW_BLOCK) {
    return blockValue / 100 * 65;
  }

  if (nHeight < params.RAMP_TO_BLOCK) {
    ret = 0;
  } else if (nHeight <= 13440 && nHeight >= params.RAMP_TO_BLOCK) {
    ret = blockValue * 0.3;
  } else if (nHeight <= 40320 && nHeight >= 13440) {
    ret = blockValue * 0.45; 
    } else if (nHeight <= 192960 && nHeight > 40320) {
        ret = blockValue * 0.35; 
    } else if (nHeight <= 250000 && nHeight > 192960) {
        ret = blockValue * 0.275;
    } else if (nHeight <= 580000 && nHeight > 250000) {
		ret = blockValue * 0.65;
    } else {
        ret = blockValue * 0.8; // 80% Masternode,  20% PoS

  }

  return ret;
};

const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 0.0;
  let nSlowSubsidy = 0.0;

  if (nHeight === 1) {
    nSubsidy = 7500000.00;
  } else if (nHeight <= params.LAST_POW_BLOCK && nHeight >= params.RAMP_TO_BLOCK) {
    nSubsidy = 40;
  } else if (nHeight <= 40320 && nHeight > params.LAST_POW_BLOCK) {
    nSubsidy = 40;
  } else if (nHeight <= 192960 && nHeight > 40320) {
    nSubsidy = 40;
  } else if (nHeight <= 250000 && nHeight > 192960) {
    nSubsidy = 30;
  } else if (nHeight <= 350000 && nHeight > 250000) {
    nSubsidy = 15;
  } else if (nHeight <= 580000 && nHeight > 350000) {
    nSubsidy = 10;
  } else if (nHeight <= 753000 && nHeight > 580000) {
    nSubsidy = 5;
  } else if (nHeight <= 1000000 && nHeight > 753000) {
    nSubsidy = 2.5;
  } else if (nHeight <= 2500000 && nHeight > 1000000) {
    nSubsidy = 1.25;
  } else {
    nSubsidy = 1;
  }

  return nHeight >= params.RAMP_TO_BLOCK ? nSubsidy : nSlowSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof (s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof (s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof (s) === 'string' && s.length === 64;
};

/**
 * How we identify if a raw transaction is Proof Of Stake & Masternode reward
 * @param {String} rpctx The transaction hash string.
 */
const isRewardRawTransaction = (rpctx) => {
  return rpctx.vin.length == 1 &&
    rpctx.vout.length == 3 && // @todo it's possible for reward to have >3 outputs. Ex: "159ff849ae833c3abd05a7b36c5ecc7c4a808a8f1ef292dad0b02875009e009e" on Bulwark Coin (governance)
    // First vout is always in this format
    rpctx.vout[0].value == 0.0 &&
    rpctx.vout[0].n == 0 &&
    rpctx.vout[0].scriptPubKey &&
    rpctx.vout[0].scriptPubKey.type == "nonstandard";

}

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isPoS,
  isTX,
  isRewardRawTransaction
};
