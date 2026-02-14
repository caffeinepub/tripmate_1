import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCallerTripPlans } from '../hooks/useTrips';
import TripPlanView from '../components/trips/TripPlanView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TripPlanDetailPage() {
    const { tripId } = useParams({ from: '/trip/$tripId' });
    const navigate = useNavigate();
    const { data: trips = [], isLoading } = useGetCallerTripPlans();

    const tripIndex = parseInt(tripId);
    const trip = trips[tripIndex];

    if (isLoading) {
        return (
            <div className="container max-w-6xl mx-auto py-8 px-4">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Trip Not Found</CardTitle>
                        <CardDescription>
                            The trip you're looking for doesn't exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate({ to: '/planner' })}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Trip Planner
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            <Button
                variant="ghost"
                onClick={() => navigate({ to: '/planner' })}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Trips
            </Button>
            <TripPlanView trip={trip} />
        </div>
    );
}
