
import { NextResponse } from 'next/server';
import { portfolioService } from '@/services/portfolio-service';
import { connectDB } from '@/lib/db';

export async function GET() {
  await connectDB();
  // For demo, using a static userId
  const userId = 'demo-user';
  const portfolio = await portfolioService.getPortfolio(userId);
  return NextResponse.json(portfolio);
}

export async function POST(req: Request) {
  await connectDB();
  const userId = 'demo-user';
  const { symbol, type, quantity, price } = await req.json();
  
  try {
    const updatedPortfolio = await portfolioService.executeTrade(userId, symbol, type, quantity, price);
    return NextResponse.json(updatedPortfolio);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
