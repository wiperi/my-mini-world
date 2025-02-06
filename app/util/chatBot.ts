import { HfInference } from "@huggingface/inference"

type ConversationEntry = {
  role: "user" | "assistant" | "system";
  content: string;
};

type StreamChunk = {
  choices: Array<{
    delta: {
      content: string;
    };
  }>;
};

export let conversationHistory: ConversationEntry[] = [];

export async function* chatBot(userInput: string): AsyncGenerator<string> {
  let out = "";

  // Add the user's input to the conversation history
  conversationHistory.push({ role: "user", content: userInput });

  try {
    // Create fetch request to our backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Get the response as a readable stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to get stream reader');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      out += chunk;
      yield chunk;
    }

    // Add the assistant's response to the conversation history
    conversationHistory.push({ role: "assistant", content: out });
  } catch (error) {
    console.error("Error in chatBot:", error);
    yield "Sorry, I encountered an error while processing your request.";
  }
}

// if (require.main === module) {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   rl.setPrompt("You: ");
//   rl.prompt();

//   rl.on("line", async (input: string) => {
//     for await (const response of chatBot(input)) {
//       console.log(response);
//       process.stdout.write(response);
//     }
//     rl.prompt();
//   });
// }
