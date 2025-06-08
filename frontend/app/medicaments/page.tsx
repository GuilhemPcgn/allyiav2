"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Upload, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import Dock from "@/components/Dock";
import MedicamentCard from "@/components/MedicamentCard";
import PharmacyList from "@/components/PharmacyList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
        [key: string]: {
            open?: string;
            close?: string;
        };
    };
    reviews: {
        id: string;
        author: string;
        rating: number;
        date: string;
        comment: string;
    }[];
}

interface DetectedDrug {
    id: number;
    name: string;
    posology?: string;
    timeLength?: string;
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
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectedDrugs, setDetectedDrugs] = useState<DetectedDrug[]>([]);
    const [showDrugForm, setShowDrugForm] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', '1');

        try {
            const response = await fetch('http://localhost:5848/ordinances', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Réponse erreur ordonnance :", errorData, response.status, response.statusText);
                throw new Error(
                    errorData?.message || 
                    `Erreur serveur: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            if (!data.drugs || !Array.isArray(data.drugs)) {
                throw new Error('Format de réponse invalide');
            }

            setDetectedDrugs(data.drugs);
            setShowDrugForm(true);
        } catch (err) {
            console.error('Erreur détaillée:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse de l\'ordonnance');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDrugFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
        setShowDrugForm(false);
        // Recharger les médicaments
        window.location.reload();
    };

    // Chargement des médicaments depuis l'API
    useEffect(() => {
        const fetchMedicaments = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5848/drugs');
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Format de données invalide');
                }
                setAllMedicaments(data);
            } catch (error) {
                console.error('Erreur détaillée:', error);
                setError(error instanceof Error ? error.message : 'Impossible de charger les médicaments');
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
        return (
            <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Chargement des médicaments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-red-500">Erreur: {error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Dock />

            {/* Loader pendant le traitement */}
            {isProcessing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p>Analyse de l'ordonnance en cours...</p>
                    </div>
                </div>
            )}

            {/* Formulaire des médicaments détectés */}
            <Dialog open={showDrugForm} onOpenChange={setShowDrugForm}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Médicaments détectés</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDrugFormSubmit} className="space-y-6">
                        {detectedDrugs.map((drug, index) => (
                            <Card key={drug.id} className="p-4">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">{drug.name}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`posology-${index}`}>Posologie</Label>
                                            <Input
                                                id={`posology-${index}`}
                                                value={drug.posology || ''}
                                                onChange={(e) => {
                                                    const newDrugs = [...detectedDrugs];
                                                    newDrugs[index].posology = e.target.value;
                                                    setDetectedDrugs(newDrugs);
                                                }}
                                                placeholder="Ex: 1 comprimé matin et soir"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`timeLength-${index}`}>Durée du traitement</Label>
                                            <Input
                                                id={`timeLength-${index}`}
                                                value={drug.timeLength || ''}
                                                onChange={(e) => {
                                                    const newDrugs = [...detectedDrugs];
                                                    newDrugs[index].timeLength = e.target.value;
                                                    setDetectedDrugs(newDrugs);
                                                }}
                                                placeholder="Ex: 7 jours"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDrugForm(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit">
                                Confirmer
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

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
                        <div className="flex flex-col gap-6">
                            {/* Zone de recherche avec suggestions */}
                            <div className="relative">
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

                            {/* Bouton d'upload d'ordonnance */}
                            <div className="flex items-center gap-4">
                                <Button 
                                    onClick={handleUploadClick}
                                    className="flex items-center gap-2"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Analyse en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Scanner une ordonnance
                                        </>
                                    )}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
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
                        </div>
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
