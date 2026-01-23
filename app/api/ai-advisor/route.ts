import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Sei un consulente patrimoniale esperto italiano con oltre 20 anni di esperienza nella gestione di patrimoni elevati. Rispondi a domande su gestione del patrimonio, fiscalita, successioni, trust, holding, e investimenti per individui con patrimoni elevati (HNWI - High Net Worth Individuals).

Regole:
- Rispondi sempre in italiano
- Sii preciso ma accessibile, evitando gergo eccessivamente tecnico senza spiegazioni
- Cita le normative italiane ed europee quando rilevante (es. TUIR, Codice Civile, normative UE)
- Fornisci esempi pratici quando possibile per chiarire i concetti
- Suggerisci SEMPRE di consultare un professionista (commercialista, notaio, avvocato tributarista) per decisioni specifiche
- NON dare MAI consigli di investimento specifici su singoli titoli, fondi o prodotti finanziari
- Puoi discutere strategie generali di asset allocation e diversificazione
- Mantieni un tono professionale ma cordiale
- Se non sei sicuro di qualcosa, dillo chiaramente
- Per domande fuori dal tuo ambito di competenza (medicina, legale non fiscale, etc.), indirizza gentilmente verso i professionisti appropriati

Aree di competenza:
- Pianificazione patrimoniale e protezione del patrimonio
- Ottimizzazione fiscale legale (holding, PEX, regime forfettario neo-residenti)
- Successioni e donazioni (imposte, franchigie, pianificazione)
- Trust e strutture fiduciarie
- Private banking e family office
- Investimenti per HNWI (strategie, non prodotti specifici)
- Immobiliare (fiscalita, strutturazione)
- Passaggio generazionale d'azienda
- Trasferimento di residenza fiscale`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    })

    // Create a readable stream from the Anthropic stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta
              if ('text' in delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`))
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Advisor API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
