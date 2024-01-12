# Local LLM Chat

This is the web user interface for a local chat completion app for use with
LLMs running locally, as well as a persistent message and document embeddings
store using Postgres.

LLMs are run locally using [Ollama](https://ollama.ai).

## Table of Contents 📚

- [Motivation](#motivation)
  - [Fine Tuning](#fine-tuning)
  - [Retrieval Augmented Generation](#retrieval-augmented-generation)
  - [Main Problems](#main-problems)
  - [Conclusion](#conclusion)
- [Setup]

## Motivation

With [Large Language Models](https://en.wikipedia.org/wiki/Large_language_model) on the rise, models such as
[Anthropic's Claude](https://claude.ai/) and [ChatGPT](https://chat.openai.com/) are all the rage. However,
they can only run on servers run by external parties and
data is sent over the wire to them.

While they may be powerful, often times they are overpowered
for simple applications like code generation, small tasks
and analysis of small documents. This is where smaller
models that are open-source come in.

### Fine Tuning

With instructional fine-tuning and sliding context windows,
smaller models such as Mistral AI's [Mistral 7B](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) demonstrate
that smaller models can perform decently when fine-tuned to
certain prompt formats.

For instance, Mistral 7B is fine tuned on an instructional
format with **Instruction Tokens** (`[INST]`, `[/INST]`)
that eliminate the need for complex prompting. They simply
require the user to feed their instructions between the
tokens, and the model will take it as an instruction and
give an output accordingly.

This leaves more context for smaller models such as Mistral
7B to take in larger inputs, regardless of its smaller
size and context window. Using our [Ollama.ai](https://ollama.ai/library/mistral) configuration
running locally, we are able to use up to **32678** characters
of context length.

### Retrieval Augmented Generation

While such Large models may be trained on large corpuses of
data, often times it may be hard to retrieve accurate or
relevant data to the user's query given the sheer size of
the model's training data.

By performing an indexing over relevant source documents,
and retrieving the relevant context from these documents
with regards to a user's query, we can provide this context
to the model for it to ground its response based on the
context retrieved from our source documents.

This makes the model's output more relevant to the query and
the use case of the user.

### Main Problems

Often times, such tools combining instructional fine-tuning
be it through prompts, fine-tuned models such as GPT-4 or
even RAG Chat with PDF apps require a paywall to use.

In addition to the above, this app aims to solve 3 problems, namely:

1. **Paying to use these features.**

    Through the use of similar
    fine-tuned models from open-source contributors, and careful
    prompting, we can often achieve similar results on smaller
    contexts or documents.

2. **Providing the ability to regenerate and reset the chat context**

    When a chat history grows long, the model's response
    may be focused on the messages at the start of the chat.

    This app aims to mitigate this by allowing the user to add/delete
    breakpoints in the chat, regenerate outputs, and finetune the
    model's responses based on contiguous subsets of the chat history.

    For instance, the start of the chat may ask about one part of
    a document, leading the model to focus on that document.

    By adding a breakpoint, the user can start fresh and ask questions
    about other parts of the document, letting the model give answers
    as if the context was fresh.

3. **Data Privacy**

    When you use a "Chat with your PDF" tool, you upload data
    to their model and/or server. This is not an option for
    sensitive documents.

    This app mitigates that by:

    - Providing a local Vector Store using Postgres to save
        your document embeddings to your local disk with Docker
        volumes
    - Downloading open-source [ONNX](https://github.com/xenova/transformers.js) binaries to run embeddings
        locally within the app, instead of remote models.
    - Using of local model weights with models such as [Mistral]
        running within Ollama, and your traffic not being
        sent to external servers.

### Conclusion

By running this cluster and connecting it to your Ollama-based container,
I hope this improves your experience in implementing
custom chat-model solutions as opposed to paying
large premiums for external models.

## Setup

1. Clone this repository.

2. Set these values in a file titled `.env.dev` at
    the project root:

    ```sh
    NEXT_PUBLIC_VAR_ONE="hello"
    VAR_ONE="dev"

    DB_HOST="127.0.0.1"
    DB_PORT=5431
    DB_NAME="llmchat"
    DB_USER="locallm"
    DB_PASSWORD="locallm"

    OLLAMA_BASE_URL="http://127.0.0.1:11434"
    ```

3. Set up [Ollama](https://ollama.ai/download)
    and start it up. It only works on Mac/Linux for now.

4. Ensure that you have Docker on your system. Start the
    Docker Desktop app. Also ensure that you have the
    version of Node and NPM listed here:

    - `node`: 20.11
    - `npm`: 10.3.0 or later

5. In the project root, run these commands:

    ```sh
    # Install deps
    npm install

    # Prep the repo
    npm run prepare

    # Build the production build
    npm run build

    # Start the Postgres
    docker compose up -d

    # Migrate the Postgres
    npm run migrate

    # Start the server.
    npm run start
    ```

6. Go to [http://localhost:3000](http://localhost:3000) in your browser.

7. Take care not to upload files larger than 5MB. The
  app may error due to the large volume of embeddings needed.

## Configurations and Considerations

### Embeddings Models

When choosing an Embedding model, we want one which
performs well on the MTEB (Massive Text Embedding
Benchmark).

While choosing a high performance one matters, we also
need the latency to be low. Hence, we need to pick
a decent performing model that is not too large so that
we can run it locally with good results.

**Models Tested**:

- [Xenova/gte-base](https://huggingface.co/Xenova/gte-base) - Better quality, slower
- [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) - Lower quality, faster

To test other models, ensure that the model has ONNX
weights so that our client (Langchain.js) supports it.

Then, in the file [huggingfaceEmbeddings.ts](./src/lib/models/embeddings/huggingfaceEmbeddings.ts), change
the model name (We suggest [Xenova's Feature Extraction models](https://huggingface.co/models?pipeline_tag=feature-extraction&sort=trending&search=Xenova) on HuggingFace)

### Chat Models

For our model, we run [Mistral 7B](https://ollama.ai/library/mistral) via Ollama.

For a model to work with the app, we use the LangchainJS
`ChatOllama` interface. To test other models, you
may change the parameters in the [chatOllama.ts](/src/lib/models/chat/chatOllama.ts) file to pass a different model
name or endpoint URL for your Ollama container.

### Vector Store

For this, we use a persisted PG Vector database
for both the app metadata to persist your chat history
to your local Docker Postgres container.

To configure embeddings you may edit the
[vectorStore.ts](/src/lib/models/vectorStore.ts) file to
change the database. Do note that it may or may not
affect the other files, such as API Routes within the `app/api` folder.

To change the metadata store, you may adjust the
[dbInstance.ts](/src/lib/db/dbInstance.ts) file
parameters for your database connection parameters.
