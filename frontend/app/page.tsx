"use client";

import { MessageCircle, LineChart, Pill } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // simulate loading
    setTimeout(() => setIsLoading(false), 1000);
    // simulate username
    setUsername("Sophie");
  }, []);

  const features = [
    {
      title: "Chatbot",
      description: "Discute avec moi en toute confidentialité",
      icon: MessageCircle,
      color: "bg-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender-dark))]",
      onClick: () => router.push("/chatbot"),
    },
    {
      title: "Dashboard",
      description: "Visualise ton parcours et tes progrès",
      icon: LineChart,
      color: "bg-[hsl(var(--mint))] hover:bg-[hsl(165,55%,77%)]",
      onClick: () => router.push("/dashboard"),
    },
    {
      title: "Médicaments",
      description: "Gère tes traitements et rappels",
      icon: Pill,
      color: "bg-[hsl(var(--peach))] hover:bg-[hsl(15,85%,80%)]",
      onClick: () => router.push("/medicaments"),
    },
  ];

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4 mb-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-[hsl(var(--lavender))] rounded-full animate-pulse"></div>
            <div className="absolute inset-3 bg-white rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[hsl(var(--lavender-dark))] rounded-full animate-bounce"></div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
            {isLoading ? (
              <span className="animate-pulse">Chargement...</span>
            ) : (
              <>Bonjour <span className="text-[hsl(var(--lavender-dark))]">{username}</span>,</>
            )}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600">
            que veux-tu faire aujourdhui ?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={feature.onClick}
              className={`${feature.color} rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[hsl(var(--lavender))]`}
            >
              <div className="flex flex-col h-full space-y-4">
                <feature.icon className="w-8 h-8 text-gray-800" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}