"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllMentors, getAllFounders } from "@/lib/store";
import type { ChatMessage } from "@/lib/types";

interface AIChatPanelProps {
  type: "mentors" | "founders";
}

export function AIChatPanel({ type }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        type === "mentors"
          ? "Hi! I'm the Lemons AI assistant. Tell me what kind of mentor you're looking for — your industry, stage, challenges — and I'll recommend people from our network."
          : "Hi! I'm the Lemons AI assistant. Describe the kind of founders you'd like to connect with, and I'll suggest people from our community.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          type,
          history: [...messages, userMessage].slice(-10),
          mentors: getAllMentors(),
          founders: getAllFounders(),
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">Lemons AI Assistant</p>
          <p className="text-xs text-muted-foreground">
            Powered by AI &middot; Searching {type === "mentors" ? "mentor" : "founder"} network
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback
                  className={
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground text-xs"
                      : "bg-muted text-muted-foreground text-xs"
                  }
                >
                  {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-xl bg-muted px-3.5 py-2.5 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              type === "mentors"
                ? "Describe what you're looking for in a mentor..."
                : "Describe the founders you'd like to connect with..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
