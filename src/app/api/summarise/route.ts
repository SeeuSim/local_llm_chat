export async function POST(req: Request) {
  const user = 'Hi! What can you do?';
  const system = `Hello! As a text-based artificial intelligence, I don't have the ability to
  physically perform tasks or interact with the world around me like a human or an animal does.
  However, I can process and generate text based on the information and instructions provided
  to me. I can answer questions, generate creative stories or poems, help brainstorm ideas,
  provide explanations or definitions, translate text between languages, and much more! Let me
  know how I can assist you today.`;

  const template = `
  <s>
  [INST]
  You are an expert conversation summariser. Generate an accurate, short, < 8 word sumamry
  about what the 'User' persona is asking the 'Assistant' persona to do. Exclude all references
  to the User and the System.
  
  CONVERSATION:
  User: ${user.replaceAll(/\[(\/)?INST\]/g, '')}
  Assistant: ${system.replaceAll(/\[(\/)?INST\]/g, '')}
  END CONVERSATION

  Return only the summary, make sure is is 8 words or less, and nothing else.
  [/INST]
  </s>
  `;

  return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
}
