import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerTripPlans } from '../hooks/useTrips';
import TripDetailsForm from '../components/trips/TripDetailsForm';
import MyTripsList from '../components/trips/MyTripsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, List } from 'lucide-react';

export default function TripPlannerPage() {
    const [activeTab, setActiveTab] = useState('new');
    const { data: trips = [], isLoading } = useGetCallerTripPlans();
    const navigate = useNavigate();

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Trip Planner</h1>
                <p className="text-muted-foreground text-lg">
                    Create a new trip or manage your existing travel plans
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="new" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Trip
                    </TabsTrigger>
                    <TabsTrigger value="my-trips" className="gap-2">
                        <List className="h-4 w-4" />
                        My Trips ({trips.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan a New Trip</CardTitle>
                            <CardDescription>
                                Tell us about your trip and we'll create a personalized itinerary for you
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TripDetailsForm
                                onSuccess={(tripPlan) => {
                                    const tripIndex = trips.findIndex(
                                        t => t.tripDetails.destination === tripPlan.tripDetails.destination &&
                                        t.tripDetails.startDate === tripPlan.tripDetails.startDate
                                    );
                                    navigate({ to: '/trip/$tripId', params: { tripId: tripIndex.toString() } });
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="my-trips" className="mt-6">
                    <MyTripsList trips={trips} isLoading={isLoading} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
