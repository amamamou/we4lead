import { NextResponse } from 'next/server'

// Simple in-memory store for dev/demo only. Not for production.
let availabilityStore: Record<string, unknown> = {}

export async function GET() {
  return NextResponse.json({ ok: true, data: availabilityStore })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // naive assign - in real app, validate and persist to DB
    availabilityStore = body || {}
    return NextResponse.json({ ok: true, data: availabilityStore })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 400 })
  }
}
