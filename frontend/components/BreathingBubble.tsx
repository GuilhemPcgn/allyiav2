export function BreathingBubble() {
    return (
        <div className="relative w-72 h-72 mx-auto">
            <div className="absolute inset-0 bg-blue-200/30 rounded-full animate-ping-slow"></div>
            <div className="absolute inset-4 bg-blue-300/40 rounded-full animate-ping-slower"></div>
            <div className="absolute inset-8 bg-blue-400/50 rounded-full animate-breath"></div>
            <div className="absolute inset-12 bg-blue-500/60 rounded-full transform scale-90"></div>
        </div>
    );
}