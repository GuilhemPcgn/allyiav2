"use client";

import { useState, useEffect } from "react";

interface WeeklyChat {
    week: string;
    mood: string;
    summary: string;
    lastChat: string;
}

export function WeeklyChats() {
    const [weeklyData, setWeeklyData] = useState<WeeklyChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeeklyChats = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/weekly-chats');
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des conversations');
                }
                const data = await response.json();
                setWeeklyData(data);
            } catch (error) {
                console.error('Erreur:', error);
                setError('Impossible de charger les conversations');
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyChats();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des conversations</h2>

            {weeklyData.map((week, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium text-gray-800">{week.week}</span>
                        <span className="text-3xl">{week.mood}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{week.summary}</p>
                    <p className="text-sm text-gray-500">Dernier échange: {week.lastChat}</p>
                </div>
            ))}
        </div>
    );
}