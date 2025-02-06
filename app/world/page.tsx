"use client";

import { useEffect } from "react";
import SideChatbox from "./SideChatbox";
import WorldMap from "./WorldMap";
import defaultAvatar from "../assets/snow.png";
import Background from "./background";
import { useAppStore } from "../store/appStore";
import { conversationHistory } from "../util/chatBot";
import myInfo from '../presetInfo'

export default function WorldPage() {
  const { setIsExpanded, addMessageStream } = useAppStore();

  useEffect(() => {
    setIsExpanded(true);

    addMessageStream(
      `Hey there!👋 Welcome to my digital universe - Tian's Mini World! Here, you can discover the connections I've made across the globe through my experiences (despite not so many 😓). Feel free to click around and explore, or just ask me anything, whether it's about my hobby 🏃 or my journey as a developer 💻.
      [ps: Did some prompt engineering based on Qwen-2.5-72B. Model might occasionally overload. Please check availability when encouting an error.]`
    );
  }, []);

  conversationHistory.push({ role: "system", content: myInfo });

  return (
    <>
      <Background />
      <WorldMap />
      <SideChatbox />
    </>
  );
}
