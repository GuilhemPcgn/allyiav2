"use client";

import { MessageCircle, LineChart, Pill } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Dock() {
    const router = useRouter();
    const pathname = usePathname();

    const navigation = [
        {
            icon: MessageCircle,
            path: "/chatbot",
            label: "Chatbot",
        },
        {
            icon: LineChart,
            path: "/dashboard",
            label: "Dashboard",
        },
        {
            icon: Pill,
            path: "/medicaments",
            label: "Médicaments",
        },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--lavender))] backdrop-blur-md bg-opacity-95 rounded-full shadow-lg px-16 py-3 flex gap-16 items-center z-50">
            {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                    <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`${isActive ? "bg-[hsl(var(--lavender-dark))]" : "hover:bg-[hsl(var(--lavender-dark))]"
                            } p-2 rounded-full transition-colors`}
                        aria-label={item.label}
                    >
                        <Icon className="w-6 h-6 text-gray-800" />
                    </button>
                );
            })}
        </div>
    );
}