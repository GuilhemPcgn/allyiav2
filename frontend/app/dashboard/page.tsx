"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import Dock from "@/components/Dock";
import {
    LineChart as ReChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface MoodData {
    jour: string;
    humeur: number;
    anxiété: number;
    fatigue: number;
    pensées_positives: number;
    pensées_négatives: number;
}

interface UserProfile {
    firstname: string;
    lastname: string;
    age: number;
    city: string;
}

export default function Dashboard() {
    const [moodData, setMoodData] = useState<MoodData[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupération des données de mood
                const moodResponse = await fetch('http://localhost:3000/api/mood-data');
                if (!moodResponse.ok) {
                    throw new Error('Erreur lors du chargement des données de mood');
                }
                const moodData = await moodResponse.json();
                setMoodData(moodData);

                // Récupération du profil utilisateur
                const profileResponse = await fetch('http://localhost:3000/api/user/profile');
                if (!profileResponse.ok) {
                    throw new Error('Erreur lors du chargement du profil');
                }
                const profileData = await profileResponse.json();
                setUserProfile(profileData);
            } catch (error) {
                console.error('Erreur:', error);
                setError('Impossible de charger les données');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Dock />

            {/* Content */}
            <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
                {/* Profile Section */}
                {userProfile && (
                    <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-sm">
                        <div className="w-20 h-20 bg-[hsl(var(--lavender))] rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-800" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {userProfile.firstname} {userProfile.lastname}
                            </h2>
                            <p className="text-gray-600">
                                {userProfile.age} ans • {userProfile.city}
                            </p>
                        </div>
                    </div>
                )}

                {/* Graph Card */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Suivi hebdomadaire</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReChart data={moodData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="jour" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="humeur" stroke="#c4b5fd" strokeWidth={2} />
                                <Line type="monotone" dataKey="anxiété" stroke="#fecaca" strokeWidth={2} />
                                <Line type="monotone" dataKey="fatigue" stroke="#bfdbfe" strokeWidth={2} />
                                <Line type="monotone" dataKey="pensées_positives" stroke="#86efac" strokeWidth={2} />
                                <Line type="monotone" dataKey="pensées_négatives" stroke="#fca5a5" strokeWidth={2} />
                            </ReChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}