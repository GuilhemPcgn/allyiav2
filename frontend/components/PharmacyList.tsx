'use client';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
}

interface Hours {
    open?: string;
    close?: string;
}

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    distance: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
    hours: { [key: string]: Hours };
    reviews: Review[];
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
export default function PharmacyList({ pharmacies }: { pharmacies: Pharmacy[] }) {
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
            <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
    );
}

function formatHours(hours: Hours) {
    if (!hours || !hours.open || !hours.close) return "Fermé";
    return `${hours.open} - ${hours.close}`;
}

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

return (
        <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
            {pharmacies.map((pharmacy) => (
                <Accordion type="single" collapsible key={pharmacy.id}>
                    <AccordionItem value="details" className="border-none">
                        <Card className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{pharmacy.name}</h3>
                                        <p className="text-sm text-gray-600">{pharmacy.address}</p>
                                        <p className="text-sm text-gray-500 mt-1">à {pharmacy.distance}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <StarRating rating={pharmacy.rating} />
                                            <span className="text-sm text-gray-500">
                                                ({pharmacy.reviewCount} avis)
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={pharmacy.isOpen ? "default" : "secondary"}
                                        className={pharmacy.isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                    >
                                        {pharmacy.isOpen ? "Ouvert" : "Fermé"}
                                    </Badge>
                                </div>

                                <AccordionTrigger className="py-0">Voir plus de détails</AccordionTrigger>

                                <AccordionContent>
                                    <div className="space-y-4 pt-4">
                                        {/* Horaires */}
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Horaires d ouverture
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {days.map((day) => (
                                                    <div key={day} className="flex justify-between text-sm">
                                                        <span className="capitalize">{day}</span>
                                                        <span className="text-gray-600">
                                                            {formatHours(pharmacy.hours[day])}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Avis */}
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-2">Avis récents</h4>
                                            <div className="space-y-3">
                                                {pharmacy.reviews.map((review) => (
                                                    <div key={review.id} className="border-t pt-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-sm">{review.author}</p>
                                                                <StarRating rating={review.rating} />
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(review.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </div>
                        </Card>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    );
}

