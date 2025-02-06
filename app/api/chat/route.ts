import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Check if the HUGGINGFACE_API_KEY is set in environment variables
if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
}

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  const { message } = JSON.parse(JSON.stringify(body));

  let finalMessage = [
    {
      role: "system",
      content: "You are a person named Tian. Your are introducing yourself to a new friend. Never ask a question in the end of response."
    },
    {
      role: "system",
      content: `## tian's connection about Zhengzhou

Zhengzhou is my hometown. It is a city on the plains, with countless delicious local foods.

My good buddy Tonton, a 4-year-old Labrador, also lives here.

## tian's connection about USA 

About USA, I love its music and games.

My favorite band Metallica is from here, and I once went to their concert in LA.

My first guitar came from here, the classic Les Paul.

During my free time, I usually practice playing "For Whom the Bell Tolls" and play CS2.

## tian's connection about Canada

I once broke my leg while learning to ski here.

My best friend lives here.

The winters here are really cold.

## tian's connection about Sydney

I currently live in Sydney.

Computer Science degree, year 2.

My favorite weekend activity is having picnics with friends at Centennial Park.

## tian's software projects 

First project

Project Amandine (http://amandine.tian77.me) is a web-based multiplayer online quiz game that I developed as a full-stack project. Inspired by COMP1531

Built with Express and TypeScript on the backend and React/Redux on the frontend, it features comprehensive user management, quiz creation/editing, and real-time gameplay. The backend implements robust test coverage with Jest, state management via finite state machines, and JWT authentication. The frontend utilizes Ant Design components, TailwindCSS for responsive layouts, and optimized state management with Redux. Key technical highlights include API versioning, type-safe development practices, and containerized deployment with Nginx.


Second project

NovusCRM (https://github.com/wiperi/NovusCRM) is a web-based CRM system. It is still in developing. As the backend developer, I built it using Java and Spring Boot with MySQL database.
`
    },
    {
    role: "user",
    content: message
  },
];

  // Set up streaming response
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Start the streaming process
  (async () => {
    try {
      const response = await client.chatCompletionStream({
        model: "Qwen/QwQ-32B-Preview",
        messages: finalMessage,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 0.7
      });

      for await (const chunk of response) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          await writer.write(encoder.encode(newContent));
        } 
      }
    } catch (error) {
      console.error('Error in chat API:', error);
      await writer.write(encoder.encode('Sorry, an error occurred.'));
    } finally {
      await writer.close();
    }
  })();

  // Return the readable stream
  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  });
} 