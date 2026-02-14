import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, Utensils, Hotel, CheckSquare, Sparkles } from 'lucide-react';
import type { TripPlan } from '../../backend';
import SponsoredSuggestions from './SponsoredSuggestions';

interface TripPlanViewProps {
    trip: TripPlan;
}

export default function TripPlanView({ trip }: TripPlanViewProps) {
    const startDate = new Date(Number(trip.tripDetails.startDate) / 1_000_000);
    const endDate = new Date(Number(trip.tripDetails.endDate) / 1_000_000);

    return (
        <div className="space-y-8">
            {/* Trip Overview */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                            <CardTitle className="text-3xl flex items-center gap-3">
                                <MapPin className="h-8 w-8 text-primary" />
                                {trip.tripDetails.destination}
                            </CardTitle>
                            <CardDescription className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-base px-4 py-2">
                            <Users className="h-4 w-4 mr-2" />
                            {trip.tripDetails.tripType}
                        </Badge>
                    </div>
                </CardHeader>
                {(trip.tripDetails.interests || trip.tripDetails.notes) && (
                    <CardContent className="space-y-4">
                        {trip.tripDetails.interests && (
                            <div>
                                <h4 className="font-semibold mb-2">Interests</h4>
                                <p className="text-muted-foreground">{trip.tripDetails.interests}</p>
                            </div>
                        )}
                        {trip.tripDetails.notes && (
                            <div>
                                <h4 className="font-semibold mb-2">Notes</h4>
                                <p className="text-muted-foreground">{trip.tripDetails.notes}</p>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Day-by-Day Itinerary */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Day-by-Day Itinerary
                </h2>
                <div className="space-y-4">
                    {trip.itinerary.map((day) => (
                        <Card key={day.day}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Day {day.day}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Activities
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {day.activities.map((activity, idx) => (
                                            <li key={idx}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>

                                <Separator />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Hotel className="h-4 w-4 text-primary" />
                                            Where to Stay
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {day.staySuggestions.map((stay, idx) => (
                                                <li key={idx}>{stay}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Utensils className="h-4 w-4 text-primary" />
                                            Where to Eat
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {day.foodRecommendations.map((food, idx) => (
                                                <li key={idx}>{food}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-semibold mb-2">Route Description</h4>
                                    <p className="text-muted-foreground">{day.routeDescription}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Packing Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-6 w-6 text-primary" />
                        Packing Checklist
                    </CardTitle>
                    <CardDescription>
                        Essential items for your {trip.tripDetails.tripType} trip
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="grid md:grid-cols-2 gap-2">
                        {trip.packingChecklist.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Sponsored Suggestions */}
            <SponsoredSuggestions
                destination={trip.tripDetails.destination}
                sponsoredListings={trip.sponsoredSuggestions}
            />
        </div>
    );
}
