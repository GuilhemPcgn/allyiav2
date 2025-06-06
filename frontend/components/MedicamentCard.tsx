"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";


export default function MedicamentCard({
    medicament,
    onUpdate,
    onDelete,
    initialFlip = false,
}: MedicamentCardProps) {
    // On démarre en mode formulaire si initialFlip est true.
    const [flipped, setFlipped] = useState(initialFlip);
    const [formData, setFormData] = useState<Medicament>(medicament);

    // En mode slider (hors modal), un clic sur la face avant déclenche le flip.
    const handleFlip = () => {
        setFlipped(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // On simule la validation du formulaire et on retourne la carte à sa face initiale.
        setFlipped(false);
        if (onUpdate) {
            onUpdate(formData);
        }
    };

    // Gestion de la suppression du médicament.
    const handleDelete = () => {
        if (onDelete) {
            onDelete(formData.id);
        }
    };

    return (
        <div className="w-64 h-80 cursor-pointer" style={{ perspective: "1000px" }}>
            <div
                className={`relative w-full h-full transition-transform duration-700 transform preserve-3d ${flipped ? "rotate-y-180" : ""
                    }`}
            >
                {/* Face avant */}
                <div
                    className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
                    style={{ backfaceVisibility: "hidden" }}
                    onClick={!initialFlip ? handleFlip : undefined}
                >
                    <div>
                        <h3 className="text-xl font-bold">{medicament.name}</h3>
                        <p className="mt-2">
                            {medicament.dosage} - {medicament.frequency}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            Prochaine prise : {medicament.nextIntake}
                        </p>
                    </div>
                </div>

                {/* Face arrière : formulaire d'édition */}
                <div
                    className="absolute w-full h-full backface-hidden bg-gray-100 rounded-xl shadow-md p-4 transform rotate-y-180"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Icône de suppression en haut à droite */}
                    <div className="absolute top-2 right-2">
                        <button onClick={handleDelete} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <form className="h-full flex flex-col justify-between" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                            <label className="block text-sm font-medium mt-2">Dosage</label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                            <label className="block text-sm font-medium mt-2">Fréquence</label>
                            <input
                                type="text"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                            <label className="block text-sm font-medium mt-2">Prochaine Prescription</label>
                            <input
                                type="text"
                                name="nextPrescription"
                                value={formData.nextPrescription}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                            <label className="block text-sm font-medium mt-2">Prochaine Prise</label>
                            <input
                                type="text"
                                name="nextIntake"
                                value={formData.nextIntake}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                        </div>
                        <button type="submit" className="mt-4 py-2 bg-blue-600 text-white rounded">
                            Valider
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
