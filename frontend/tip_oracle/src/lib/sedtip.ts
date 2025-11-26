import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

export async function sendSolTip(senderWallet: any, toAddress: string, solAmount: number) {
  if (!senderWallet?.publicKey) throw new Error("Wallet not connected")

  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderWallet.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: solAmount * 1e9, // SOL → lamports
    }),
  )

  const signature = await senderWallet.sendTransaction(transaction, connection)
  return signature
}
