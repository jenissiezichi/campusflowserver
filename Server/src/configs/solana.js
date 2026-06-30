import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const connection = new Connection(process.env.SOLANA_NETWORK, "confirmed");

const secretKey = JSON.parse(process.env.WALLET_SECRET_KEY);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
const wallet = new anchor.Wallet(keypair);

const idl = JSON.parse(readFileSync("./idl/idl.json", "utf8"));
const programId = new PublicKey(process.env.PROGRAM_ID);

const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});
anchor.setProvider(provider);

const program = new anchor.Program(idl, programId, provider);

export { program, provider, connection, wallet, keypair, programId };