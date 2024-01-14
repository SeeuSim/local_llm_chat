export const baseTemplate = `
[INST]
{question}
[/INST]`.trim();

export const baseChatHistoryTemplate = `
{history}
${baseTemplate}
`.trim();

// QA with documents

/**
 * Generating reflection question for accurate question for vector retrieval
 *
 * Required params:
 * - `chat_history`: A string formatted history with alternating question and answer pairs,
 *   like so: USER: <user>\n SYSTEM: <system>
 * - `question`: The user's last question
 */
export const chatHistoryReflectTemplate =
  `[INST]
  Given the following conversation and a follow up question, ` +
  `rephrase the follow up question to be a standalone question.\r\n\r\n` +
  `Chat History:\r\n` +
  `{chat_history}\r\n\r\n` +
  `Follow Up Input: {question}\r\n\r\n` +
  `Standalone Question:
  [/INST]`;

export const documentQATemplate =
  `You are an experienced researcher, expert at interpreting ` +
  `and answering questions based on provided sources. Using the ` +
  `provided context, answer the user's question to the best of your ` +
  `ability using the resources provided.\r\n` +
  `Generate a concise answer for a given question based solely on the` +
  `provided search results (URL and content). You must only use information ` +
  `from the provided search results. Use an unbiased and journalistic tone. ` +
  `Combine search results together into a coherent answer. Do not repeat text.\r\n` +
  `If there is nothing in the context relevant to the question at hand, just ` +
  `say "Hmm, I'm not sure." Don't try to make up an answer.\r\n` +
  `Anything between the following \`context\` html blocks is retrieved from a ` +
  `knowledge bank, not part of the conversation with the user.
` +
  `<context>
    {context}
  <context/>
` +
  `REMEMBER: If there is no relevant information within the context,` +
  `just say "Hmm, I'm not sure." Don't try to make up an answer. ` +
  `Anything between the preceding 'context' html blocks is retrieved ` +
  `from a knowledge bank, not part of the conversation with the user.`;

/**
 * Requires the following params:
 * - `context`: The documents from the knowledge bank
 * - `question`: The user's question
 */
export const baseDocumentQATemplate = `<s>
${documentQATemplate}
</s>
[INST]
{question}
[/INST]`;

/**
 * Requires the following params:
 * - `context`: The relevant documents from the QA store.
 * - history: The chat formatted as a [INST] pair
 * - question: The user's question
 */
export const chatDocumentQATemplate = `<s>
${documentQATemplate}
</s>
{history}
[INST]
{question}
[/INST]`;
