import OllamaSingleton from '@/lib/models/chat/chatOllama';

export async function POST(req: Request) {
  const model = await OllamaSingleton.getInstance();
}
