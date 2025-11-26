import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TipOracle } from "../target/types/tip_oracle";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("tip_oracle", () => {
  // Provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Program
  const program = anchor.workspace.TipOracle as Program<TipOracle>;

  // Wallet (creator + payer)
  const creator = provider.wallet.publicKey;

  // PDA (MUST match seeds in Rust)
  const [creatorPda, creatorPdaBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("tipping"), creator.toBuffer()],
    program.programId
  );

  // ---------------------------------------------------------------------
  // TEST 1 — INITIALIZE CREATOR PDA
  // ---------------------------------------------------------------------
  it("Initialize Creator PDA", async () => {
    const tx = await program.methods
      .initializeCreator()
      .accounts({
        creator: creator,            // Signer
        creatorAccount: creatorPda,  // PDA
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize TX:", tx);

    const acc = await program.account.creatorAccount.fetch(creatorPda);
    console.log("PDA DATA:", acc);

    if (!acc) throw new Error("PDA not created");
  });

  // ---------------------------------------------------------------------
  // TEST 2 — SEND TIP
  // ---------------------------------------------------------------------
  it("Send Tip", async () => {
    const tipAmount = new anchor.BN(0.005 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .sendTip(tipAmount)
      .accounts({
        payer: creator,              // signer
        creator: creator,            // system account
        creatorAccount: creatorPda,  // PDA
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Send Tip TX:", tx);

    const acc = await program.account.creatorAccount.fetch(creatorPda);
    console.log("Updated PDA:", acc);

    if (Number(acc.totalTips) <= 0) {
      throw new Error("Tip not recorded");
    }
  });

  // ---------------------------------------------------------------------
  // TEST 3 — WRONG PDA (should fail)
  // ---------------------------------------------------------------------
  it("Fail: Wrong PDA", async () => {
    const [fakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("tipping"), Buffer.from("THIS_IS_FAKE_PDA")],
      program.programId
    );

    try {
      await program.methods
        .sendTip(new anchor.BN(1_000_000))
        .accounts({
          payer: creator,
          creator: creator,
          creatorAccount: fakePda, // WRONG PDA
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      throw new Error("❌ Should have failed, but passed!");
    } catch (err: any) {
      console.log("✔ Correctly failed:", err.toString());
    }
  });

  // ---------------------------------------------------------------------
  // TEST 4 — OVERFLOW CASE
  // ---------------------------------------------------------------------
  it("Fail: Overflow Test", async () => {
    try {
      await program.methods
        .sendTip(new anchor.BN("18446744073709551615")) // U64 MAX
        .accounts({
          payer: creator,
          creator: creator,
          creatorAccount: creatorPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      throw new Error("❌ Overflow should have failed!");
    } catch (err: any) {
      console.log("✔ Overflow correctly failed:", err.toString());
    }
  });
});
