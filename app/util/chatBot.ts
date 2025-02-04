// import readline from "readline";

type ConversationEntry = {
  role:  "user" | "assistant";
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

  // Mocking the API response with a stream-like behavior
  const mockStreamResponse = async function* (): AsyncGenerator<StreamChunk> {
    const mockResponses = [
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
      "AI的回复.",
    ];
    for (const response of mockResponses) {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
      yield { choices: [{ delta: { content: response } }] };
    }
  };

  const stream = mockStreamResponse();

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
      yield newContent;
    }
  }

  // Add the assistant's response to the conversation history
  conversationHistory.push({ role: "assistant", content: out });
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
