
const mongoose = require('mongoose');

// This enum was originally a Typescript enum
const CarverAddressType = {
  Tx: 0,
  Address: 1,
  Coinbase: 2,
  Zerocoin: 3,
  Burn: 4,
  Fee: 5,
  ProofOfStake: 6,
  Masternode: 7,
  Governance: 8
}
const CarverAddress = mongoose.model('CarverAddress', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  label: { required: true, unique: true, index: true, type: String },
  balance: { index: true, required: true, type: Number },

  blockHeight: { index: true, required: true, type: Number }, // By storing block height we know how many blocks ago/confirmations we have
  date: { index: true, required: true, type: Date },
  carverAddressType: { index: true, required: true, type: Number },

  lastMovementDate: { index: true, required: true, type: Date },
  valueOut: { index: true, required: true, type: Number },
  valueIn: { index: true, required: true, type: Number },
  countIn: { index: true, required: true, type: Number },
  countOut: { index: true, required: true, type: Number },

  // Track rewards (CarverAddressType.Address only). That way we can subtract them from countIn/countOut to get number of non-reward txs
  posCountIn: { index: true, type: Number },
  posValueIn: { index: true, type: Number },
  posLastBlockHeight: { type: Number }, // Store last time this address received a POS reward (we use this for sequential syncing + data analytics)

  mnCountIn: { index: true, type: Number },
  mnValueIn: { index: true, type: Number },

  powCountIn: { index: true, type: Number },
  powValueIn: { index: true, type: Number },

  sequence: { required: true, type: Number },
}, { _id: false, versionKey: false }), 'carverAddresses');

// This enum was originally a Typescript enum
const CarverMovementType = {
  CoinbaseToTx: 0,

  TxIdVoutToTx: 1,
  TxToAddress: 2,

  PosTxIdVoutToTx: 3,
  TxToPosAddress: 4, // These are converted from TxToPosOutputAddress 
  TxToMnAddress: 5, // These are converted from TxToPosOutputAddress 
  TxToCoinbaseRewardAddress: 6,

  ZerocoinToTx: 7,
  TxToZerocoin: 8,
  Burn: 9,

  MasternodeRewardToTx: 10,
  PosRewardToTx: 11,
  GovernanceRewardToTx: 12,
  TxToGovernanceRewardAddress: 13,
  TxToFee: 14,

  /**
   * This is a temporary tx in POS output. There are multiple outputs in POS and we'll need to figure out which ones are going to POS address and which one is MN. We'll assume these can be in any order with any number of outputs. (An input is eligible for POS)
   * In the first pass of tx we don't call any async methods. So we'll say all outputs of POS are this temporary movement and then we'll figure out the actual address later.
   */
  TxToPosOutputAddress: 1000
}
const CarverMovement = mongoose.model('CarverMovement', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  carverMovementType: { required: true, index: true, type: Number },

  label: { required: true, unique: true, index: true, type: String },
  amount: { required: true, index: true, type: Number },

  blockHeight: { index: true, required: true, type: Number }, // By storing block height we know how many blocks ago/confirmations we have
  date: { index: true, required: true, type: Date },
  fromBalance: { required: true, type: Number },
  toBalance: { required: true, type: Number },

  from: { index: true, required: true, type: mongoose.Schema.Types.ObjectId, ref: 'CarverAddress' },
  to: { index: true, required: true, type: mongoose.Schema.Types.ObjectId, ref: 'CarverAddress' },
  destinationAddress: { index: true, type: mongoose.Schema.Types.ObjectId, ref: 'CarverAddress' }, // POS, MN & POW Rewards will also have a destinationAddress

  sequence: { unique: true, required: true, type: Number }
}, { _id: false, versionKey: false }), 'carverMovements');

module.exports = {
  CarverAddressType,
  CarverAddress,
  CarverMovementType,
  CarverMovement
}