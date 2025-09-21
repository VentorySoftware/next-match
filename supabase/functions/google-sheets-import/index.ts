import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { spreadsheetId, range, action } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY')

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Sheets API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Executing ${action} for spreadsheet: ${spreadsheetId}, range: ${range}`)

    if (action === 'read') {
      // Read data from Google Sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        console.error('Google Sheets API error:', data)
        return new Response(
          JSON.stringify({ error: data.error?.message || 'Failed to read from Google Sheets' }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Transform the raw data into structured participant data
      const values = data.values || []
      if (values.length === 0) {
        return new Response(
          JSON.stringify({ participants: [], brackets: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Assume first row contains headers
      const headers = values[0]
      const participants = values.slice(1).map((row: string[]) => {
        const participant: any = {}
        headers.forEach((header: string, index: number) => {
          participant[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || ''
        })
        return participant
      })

      console.log(`Successfully read ${participants.length} participants from Google Sheets`)

      return new Response(
        JSON.stringify({ participants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'read_brackets') {
      // Read tournament brackets/keys from Google Sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        console.error('Google Sheets API error:', data)
        return new Response(
          JSON.stringify({ error: data.error?.message || 'Failed to read brackets from Google Sheets' }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const values = data.values || []
      
      // Transform bracket data - assume format: Round, Player1, Player2, Winner, Status
      const headers = values[0] || []
      const brackets = values.slice(1).map((row: string[]) => {
        return {
          round: row[0] || '',
          player1: row[1] || '',
          player2: row[2] || '',
          winner: row[3] || '',
          status: row[4] || 'pending'
        }
      })

      console.log(`Successfully read ${brackets.length} bracket matches from Google Sheets`)

      return new Response(
        JSON.stringify({ brackets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action specified' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in google-sheets-import function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})