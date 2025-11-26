import { AnchorProvider, Program, Idl, BN } from "@coral-xyz/anchor"
import { Connection, PublicKey } from "@solana/web3.js"
import idl from "../idl/tip_oracle.json"

// Your Program ID
export const PROGRAM_ID = new PublicKey("75zeKfzrc1CzfcC6fDT3gYwTeYgqMoEkfSjbLHMykaVE")

// Derive CreatorAccount PDA
export async function getCreatorAccount(creator: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("tipping"), creator.toBuffer()],
    PROGRAM_ID
  )
}

export function getProgram(wallet: any) {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed")
  const provider = new AnchorProvider(connection, wallet, {})
  return new Program(idl as Idl, PROGRAM_ID, provider)
}

export async function sendTip(wallet: any, creator: string, amountSol: number) {
  const program = getProgram(wallet)

  const creatorPubkey = new PublicKey(creator)
  const [creatorAccount] = await getCreatorAccount(creatorPubkey)

  const lamports = new BN(amountSol * 1_000_000_000)

  const tx = await program.methods
    .sendTip(lamports)
    .accounts({
      payer: wallet.publicKey,
      creator: creatorPubkey,
      creatorAccount,
      systemProgram: new PublicKey("11111111111111111111111111111111"),
    })
    .rpc()

  return tx
}
