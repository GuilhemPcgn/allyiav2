const weeklyData = [
    {
        week: "Cette semaine",
        mood: "😊",
        summary: "Semaine positive",
        lastChat: "Il y a 2 jours"
    },
    {
        week: "Semaine dernière",
        mood: "😌",
        summary: "Semaine calme",
        lastChat: "27 fevrier"
    },
    {
        week: "Il y a 2 semaines",
        mood: "😔",
        summary: "Quelques difficultés",
        lastChat: "20 février"
    }
];

export function WeeklyChats() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl fontsemibold text-gray-800 mb-4">Historique des conversations</h2>

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