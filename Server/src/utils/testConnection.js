import { program, connection } from "../configs/solana.js";

const test = async () => {
    try {
        const slot = await connection.getSlot();
        console.log("✅ Connected to Solana Devnet");
        console.log("📦 Current slot:", slot);
        console.log("🔑 Program ID:", program.programId.toString());
    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    }
};

test();