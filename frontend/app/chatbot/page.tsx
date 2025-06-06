import { BreathingBubble } from '@/components/BreathingBubble';
import { WeeklyChats } from '@/components/WeeklyChats';
import Link from 'next/link';
import Dock from "@/components/Dock";

export default function ChatPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
            <Dock />
            <div className="max-w-2xl mx-auto pt-12">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Votre espace d'écoute</h1>

                <Link href="/chatbot/conversation" className="block mb-16">
                    <div className="relative">
                        <BreathingBubble />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-medium text-blue-600 bg-white/80 px-6 py-3 rounded-full backdrop-blur-sm shadow-sm">
                            Tap pour discuter
                            </span>
                        </div>
                    </div>
                </Link>

                <WeeklyChats />
            </div>
        </main>
    );
}