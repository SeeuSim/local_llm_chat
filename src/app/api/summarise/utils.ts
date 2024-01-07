export interface IAPISummariseInput {
  model?: string;
  userMessage: string;
  systemMessage: string;
}

export const SUPPORTED_MODELS = ['mistral'] as const;
export type TSupportedModel = (typeof SUPPORTED_MODELS)[number];

// Prompt template guardrails for prompt injection techniques for each model.
export const PROMPT_REGEXES: Record<TSupportedModel, RegExp> = {
  mistral: /\[(\/)?INST\]/g,
};

export const PROMPT_SUMMARISATION_TEMPLATES: Record<
  TSupportedModel,
  (conversation: Array<string>) => string
> = {
  mistral: (conversation: Array<string>) =>
    `<s>
    [INST]
    You are an expert conversation summariser. Generate an accurate, short, < 8 word sumamry
    about what assistance the 'User' persona is seeking from the 'Assistant'.
    
    CONVERSATION:
    ${conversation.join('\r\n')}
    END CONVERSATION

    You may format the response in this format:
    {action (in present tense only)} {on/about/for (or other quantifiers)} {action} {quantifier} { subject}
    i.e. Getting help for coding task in Bash

    Exclude all references to any assistant, AI or system. Do not elaborate or include examples.
    Return only ONE summary, making sure it is 8 words or less, and NOTHING ELSE.
    [/INST]
    </s>`.trim(),
};
