"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import Dock from "@/components/Dock";
import MedicamentCard from "@/components/MedicamentCard";
import PharmacyList from "@/components/PharmacyList";

interface Medicament {
    id: number;
    name: string;
    dosage: string;
    vidal_code: string;
    description: string;
    side_effects: string;
}

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    distance: string;
    isOpen: boolean;
    position: { lat: number; lng: number };
    rating: number;
    reviewCount: number;
    hours: {
        [key: string]: { open: string | null; close: string | null };
    };
    reviews: {
        id: string;
        author: string;
        rating: number;
        date: string;
        comment: string;
    }[];
}

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 48.8566,
    lng: 2.3522,
};

export default function Medicaments() {
    const [searchQuery, setSearchQuery] = useState("");
    const [addressQuery, setAddressQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("medicaments");
    const [selectedMedicament, setSelectedMedicament] = useState<Medicament | null>(null);
    const [selectedMedicaments, setSelectedMedicaments] = useState<Medicament[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [allMedicaments, setAllMedicaments] = useState<Medicament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', '1');

        try {
            const response = await fetch('http://localhost:5848/api/ordinances', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                const ids = data.drugs.map((d: Medicament) => d.id);
                const meds = allMedicaments.filter((m) => ids.includes(m.id));
                setSelectedMedicaments((prev) => [...prev, ...meds]);
            }
        } catch (err) {
            console.error('Erreur upload ordonnance:', err);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Chargement des médicaments depuis l'API
    useEffect(() => {
        const fetchMedicaments = async () => {
            try {
                const response = await fetch('http://localhost:5848/api/drugs');
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des médicaments');
                }
                const data = await response.json();
                setAllMedicaments(data);
            } catch (error) {
                console.error('Erreur:', error);
                setError('Impossible de charger les médicaments');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicaments();
    }, []);

    // Chargement des pharmacies depuis l'API (à implémenter)
    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await fetch('http://localhost:5848/api/pharmacies');
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des pharmacies');
                }
                const data = await response.json();
                setPharmacies(data);
            } catch (error) {
                console.error('Erreur:', error);
                setError('Impossible de charger les pharmacies');
            }
        };

        fetchPharmacies();
    }, []);

    // Filtrer les médicaments en fonction du texte saisi
    const filteredMedicaments = allMedicaments.filter((medicament) =>
        medicament.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setAddressQuery("Votre position actuelle");
                    center.lat = position.coords.latitude;
                    center.lng = position.coords.longitude;
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                }
            );
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Dock />

            <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
                <Tabs
                    defaultValue="medicaments"
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="w-full"
                >
                    <div className="relative">
                        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200">
                            <TabsTrigger
                                value="medicaments"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8"
                            >
                                Médicaments
                            </TabsTrigger>
                            <TabsTrigger
                                value="pharmacies"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8"
                            >
                                Pharmacies
                            </TabsTrigger>
                        </TabsList>
                        <div
                            className="absolute bottom-0 h-0.5 bg-[hsl(var(--lavender))] transition-all duration-300"
                            style={{
                                left: selectedTab === "medicaments" ? "0" : "50%",
                                width: "50%",
                            }}
                        />
                    </div>

                    <TabsContent value="medicaments" className="mt-6">
                        {/* Zone de recherche avec suggestions */}
                        <div className="relative mb-8">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Rechercher un médicament..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white"
                            />
                            {searchQuery && filteredMedicaments.length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-auto bg-white border border-gray-200 rounded shadow-md z-10">
                                    {filteredMedicaments.map((medicament) => (
                                        <div
                                            key={medicament.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                // Ouvrir directement le formulaire d'édition en modal
                                                setSelectedMedicament(medicament);
                                                setSearchQuery(""); // On vide le champ de recherche
                                            }}
                                        >
                                            {medicament.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <Button onClick={handleUploadClick}>
                                Uploader une ordonnance
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Slider affichant les médicaments ajoutés par l'utilisateur */}
                        {selectedMedicaments.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-xl">
                                <div className="flex space-x-4 p-4">
                                    {selectedMedicaments.map((medicament) => (
                                        <MedicamentCard
                                            key={medicament.id}
                                            medicament={medicament}
                                        />
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <p className="text-gray-500">Aucun médicament ajouté. Recherchez-en un pour l'ajouter.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="pharmacies" className="mt-6">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="search"
                                        placeholder="Entrez une adresse..."
                                        value={addressQuery}
                                        onChange={(e) => setAddressQuery(e.target.value)}
                                        className="pl-10 bg-white"
                                    />
                                </div>
                                <Button
                                    onClick={handleGeolocation}
                                    variant="outline"
                                    className="flex items-center gap-2 rounded-full"
                                >
                                    <MapPin className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="p-0 overflow-hidden">
                                    <LoadScript
                                        googleMapsApiKey={
                                            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
                                            "Clé non définie"
                                        }
                                    >
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={center}
                                            zoom={14}
                                        >
                                            {pharmacies.map((pharmacy) => (
                                                <MarkerF
                                                    key={pharmacy.id}
                                                    position={pharmacy.position}
                                                    title={pharmacy.name}
                                                />
                                            ))}
                                        </GoogleMap>
                                    </LoadScript>
                                </Card>

                                <PharmacyList pharmacies={pharmacies} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal d'édition qui se ferme en cliquant hors de la carte */}
            {selectedMedicament && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setSelectedMedicament(null)} // ferme le modal en cliquant en dehors
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <MedicamentCard
                            medicament={selectedMedicament}
                            initialFlip={true} // démarre directement en mode formulaire
                            onUpdate={(updatedMedicament: Medicament) => {
                                setSelectedMedicaments((prev) => [...prev, updatedMedicament]);
                                setSelectedMedicament(null);
                            }}
                            onDelete={(id: number) => {
                                // Ici, on supprime le médicament du tableau
                                setSelectedMedicaments((prev) => prev.filter((m) => m.id !== id));
                                setSelectedMedicament(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
