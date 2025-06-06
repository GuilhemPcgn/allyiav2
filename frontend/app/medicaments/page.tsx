"use client";

import { useState, useEffect } from "react";
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
    // Contient le médicament sélectionné dans le dropdown afin d'ouvrir le modal
    const [selectedMedicament, setSelectedMedicament] = useState<Medicament | null>(null);
    // Tableau des médicaments ajoutés par l'utilisateur (affichés dans le slider)
    const [selectedMedicaments, setSelectedMedicaments] = useState<Medicament[]>([]);

    const [pharmacies] = useState([
        {
            id: "1",
            name: "Pharmacie du Centre",
            address: "123 rue de Paris",
            distance: "500m",
            isOpen: true,
            position: { lat: 48.8566, lng: 2.3522 },
            rating: 4.5,
            reviewCount: 127,
            hours: {
                lundi: { open: "09:00", close: "19:30" },
                mardi: { open: "09:00", close: "19:30" },
                mercredi: { open: "09:00", close: "19:30" },
                jeudi: { open: "09:00", close: "19:30" },
                vendredi: { open: "09:00", close: "19:30" },
                samedi: { open: "09:30", close: "19:00" },
                dimanche: { open: "10:00", close: "13:00" }
            },
            reviews: [
                {
                    id: "1",
                    author: "Marie L.",
                    rating: 5,
                    date: "2024-01-15",
                    comment: "Personnel très professionnel et de bon conseil."
                },
                {
                    id: "2",
                    author: "Pierre D.",
                    rating: 4,
                    date: "2024-01-10",
                    comment: "Pharmacie bien située avec un large choix de produits."
                }
            ]
        },
        {
            id: "2",
            name: "Pharmacie de la Gare",
            address: "45 avenue de la République",
            distance: "750m",
            isOpen: false,
            position: { lat: 48.8576, lng: 2.3532 },
            rating: 4.2,
            reviewCount: 85,
            hours: {
                lundi: { open: "08:30", close: "20:00" },
                mardi: { open: "08:30", close: "20:00" },
                mercredi: { open: "08:30", close: "20:00" },
                jeudi: { open: "08:30", close: "20:00" },
                vendredi: { open: "08:30", close: "20:00" },
                samedi: { open: "09:00", close: "19:30" },
                dimanche: { open: null, close: null }
            },
            reviews: [
                {
                    id: "1",
                    author: "Sophie M.",
                    rating: 4,
                    date: "2024-01-20",
                    comment: "Service rapide et efficace."
                },
                {
                    id: "2",
                    author: "Jean R.",
                    rating: 5,
                    date: "2024-01-18",
                    comment: "Équipe très sympathique et disponible."
                }
            ]
        }
    ]);

    // Chargement du fichier JSON des médicaments (pour les suggestions)
    const [allMedicaments, setAllMedicaments] = useState<Medicament[]>([]);
    useEffect(() => {
        fetch("/medicaments.json")
            .then((res) => res.json())
            .then((data) => setAllMedicaments(data))
            .catch((error) =>
                console.error("Erreur lors du chargement des médicaments :", error)
            );
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
