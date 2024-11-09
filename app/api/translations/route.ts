import { NextResponse } from 'next/server'
import { loadTranslations, saveTranslations } from '@/utils/translations'

export async function GET() {
  try {
    const translations = await loadTranslations()
    
    return NextResponse.json(translations)
  } catch (error) {
    console.error('Error loading translations:', error)
    return NextResponse.json({ error: 'Failed to load translations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await saveTranslations(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving translations:', error)
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 })
  }
}