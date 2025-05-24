import { api } from "@/convex/_generated/api"
import { AssemblyAI } from "assemblyai"
import { NextResponse } from "next/server"

const assemblyAi=new AssemblyAI({apiKey:process.env.ASSEMBLY_API_KEY})
console.log("Assembly API Key:", process.env.ASSEMBLY_API_KEY);
export async function GET(req) {
    const token=await assemblyAi.realtime.createTemporaryToken({expires_in:36000})
    return NextResponse.json(token)
}