import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { userId, messages, chatId, isPro } = await req.json();

    if (!userId || !messages || messages.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Fetch profile including daily usage fields
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_pro, daily_requests, last_request_date")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.is_pro) {
      return NextResponse.json({ error: "Pro subscription required to use the AI Math Helper." }, { status: 403 });
    }

    // 2. Handle daily reset logic
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let currentRequests = profile.daily_requests || 0;

    if (profile.last_request_date !== todayStr) {
      currentRequests = 0;
      await supabase
        .from("profiles")
        .update({ daily_requests: 0, last_request_date: todayStr })
        .eq("id", userId);
    }

    // 3. Enforce 100 question daily limit
    if (currentRequests >= 100) {
      return NextResponse.json(
        { error: "You have reached your daily limit of 100 questions. Please try again tomorrow!" }, 
        { status: 429 }
      );
    }

    // Call OpenAI with the full conversation history
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are MathAround's expert AI math tutor. You ONLY handle mathematics questions, practice problems, and explanations ranging from basic addition up to advanced calculus.\n\nFormatting Rules:\n1. NEVER use raw LaTeX commands like \\text{}, \\frac{}{}, \\sqrt{}, or bracketed block math syntax like [ ... ].\n2. Write math equations using clean, standard keyboard text and slashes (e.g., write fractions as (4 + 8) / 2 = 6, and square roots as √(x)).\n3. Structure step-by-step responses using bold step titles, clean numbered lists, and bullet points for data sets.\n4. Keep explanations visual, step-by-step, and concise without unparsed math syntax."
        },
        ...messages
      ],
      temperature: 0.3,
    });

    const answer = completion.choices[0].message.content;
    const updatedMessages = [...messages, { role: "assistant", content: answer }];
    const firstUserQuery = messages[0].content; // Used as the chat title/preview in the sidebar

    let savedChatId = chatId;

    if (!chatId) {
      // Insert brand new chat thread
      const { data: insertedChat, error: insertError } = await supabase
        .from("ai_chats")
        .insert([
          { 
            user_id: userId, 
            question: firstUserQuery, 
            answer: answer,
            messages: updatedMessages 
          }
        ])
        .select()
        .single();

      if (!insertError && insertedChat) {
        savedChatId = insertedChat.id;
      }
    } else {
      // Update existing chat thread with the new message history array
      await supabase
        .from("ai_chats")
        .update({ 
          answer: answer, 
          messages: updatedMessages 
        })
        .eq("id", chatId);
    }

    // 4. Increment daily_requests count upon success
    await supabase
      .from("profiles")
      .update({ daily_requests: currentRequests + 1, last_request_date: todayStr })
      .eq("id", userId);

    return NextResponse.json({ answer, chatId: savedChatId, messages: updatedMessages });
  } catch (err) {
    console.error("AI Helper Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}