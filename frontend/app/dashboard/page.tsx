"use client";

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

const data = [
    {
        jour: "Lundi",
        humeur: 7,
        anxiété: 4,
        fatigue: 6,
        pensées_positives: 8,
        pensées_négatives: 3,
    },
    {
        jour: "Mardi",
        humeur: 6,
        anxiété: 5,
        fatigue: 7,
        pensées_positives: 6,
        pensées_négatives: 4,
    },
    {
        jour: "Mercredi",
        humeur: 8,
        anxiété: 3,
        fatigue: 5,
        pensées_positives: 9,
        pensées_négatives: 2,
    },
    {
        jour: "Jeudi",
        humeur: 7,
        anxiété: 4,
        fatigue: 6,
        pensées_positives: 7,
        pensées_négatives: 3,
    },
    {
        jour: "Vendredi",
        humeur: 9,
        anxiété: 2,
        fatigue: 4,
        pensées_positives: 9,
        pensées_négatives: 1,
    },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Dock />

            {/* Content */}
            <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
                {/* Profile Section */}
                <div className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-20 h-20 bg-[hsl(var(--lavender))] rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-800" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Sophie Martin</h2>
                        <p className="text-gray-600">26 ans • Paris</p>
                    </div>
                </div>

                {/* Graph Card */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Suivi hebdomadaire</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReChart data={data}>
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