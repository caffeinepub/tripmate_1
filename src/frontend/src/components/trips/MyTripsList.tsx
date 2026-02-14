import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight, Loader2, Compass } from 'lucide-react';
import type { TripPlan } from '../../backend';

interface MyTripsListProps {
    trips: TripPlan[];
    isLoading: boolean;
}

export default function MyTripsList({ trips, isLoading }: MyTripsListProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Compass className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>No Trips Yet</CardTitle>
                    <CardDescription>
                        Create your first trip to get started with personalized travel planning
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {trips.map((trip, index) => {
                const startDate = new Date(Number(trip.tripDetails.startDate) / 1_000_000);
                const endDate = new Date(Number(trip.tripDetails.endDate) / 1_000_000);
                const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        {trip.tripDetails.destination}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">{trip.tripDetails.tripType}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    <p>{duration} day{duration !== 1 ? 's' : ''} • {trip.itinerary.length} activities planned</p>
                                </div>
                                <Button
                                    onClick={() => navigate({ to: '/trip/$tripId', params: { tripId: index.toString() } })}
                                    className="w-full gap-2"
                                >
                                    View Trip Plan
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
