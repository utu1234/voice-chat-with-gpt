

const USE_MOCK_REPLY = true; 

export async function fetchChatCompletion(prompt: string): Promise<string> {
  if (USE_MOCK_REPLY) {
    return "This is a simulated GPT response because the OpenAI quota has been exhausted.";
  }

  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error('❌ OpenAI API key is missing!');
    return 'OpenAI API key is missing.';
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o', // or 'gpt-3.5-turbo'
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    console.error('OpenAI API error:', await res.text());
    return 'Error from OpenAI API';
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response from model';
}
