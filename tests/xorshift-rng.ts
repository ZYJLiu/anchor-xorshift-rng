import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { XorshiftRng } from "../target/types/xorshift_rng"
import { assert } from "chai"

describe("xorshift-rng", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.XorshiftRng as Program<XorshiftRng>
  const wallet = anchor.workspace.XorshiftRng.provider.wallet

  const [enemyBossPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("boss")],
    program.programId
  )

  const MAX_HEALTH = 1000

  it("Respawn", async () => {
    // Add your test here.
    const tx = await program.methods
      .respawn()
      .accounts({
        enemyBoss: enemyBossPDA,
        player: wallet.publicKey,
      })
      .rpc()
    console.log("Your transaction signature", tx)

    const enemyBossData = await program.account.enemyBoss.fetch(enemyBossPDA)
    assert(enemyBossData.health.toNumber() === MAX_HEALTH)
  })

  it("Attack", async () => {
    let enemyBossData

    try {
      do {
        // Add your test here.
        const tx = await program.methods
          .attack()
          .accounts({
            enemyBoss: enemyBossPDA,
            player: wallet.publicKey,
          })
          .rpc()
        console.log("Your transaction signature", tx)

        enemyBossData = await program.account.enemyBoss.fetch(enemyBossPDA)
        console.log("Health: ", enemyBossData.health.toNumber())
      } while (enemyBossData.health.toNumber() > -1)
    } catch (e) {
      console.log(e.error.errorMessage)
    }
  })
})
