// Minimal ABIs — only the fragments WinDrop actually calls.

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// Megapot JackpotRandomTicketBuyer.
// buyTickets(address _referrer, uint256 _value, address _recipient)
export const TICKET_BUYER_ABI = [
  {
    type: "function",
    name: "buyTickets",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_referrer", type: "address" },
      { name: "_value", type: "uint256" },
      { name: "_recipient", type: "address" },
    ],
    outputs: [],
  },
] as const;
