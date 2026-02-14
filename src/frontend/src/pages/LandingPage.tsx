import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Users, Compass } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="container relative z-10 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Compass className="h-4 w-4" />
                                Your Journey Starts Here
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Plan Your Perfect Trip with{' '}
                                <span className="text-primary">TripMate</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                                Whether you're a solo adventurer or planning a group expedition, TripMate guides you 
                                through every step—from destination to dining, routes to rest stops.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => navigate({ to: '/planner' })}
                                    className="text-lg px-8"
                                >
                                    Start Planning
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate({ to: '/explore' })}
                                    className="text-lg px-8"
                                >
                                    Explore Destinations
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="/assets/generated/tripmate-hero.dim_1600x600.png"
                                alt="TripMate - Plan your adventure"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need for Your Journey
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            TripMate provides comprehensive trip planning tools to make your adventure unforgettable
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Smart Itineraries</h3>
                                <p className="text-muted-foreground">
                                    Get personalized day-by-day plans tailored to your trip type and interests
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Route Guidance</h3>
                                <p className="text-muted-foreground">
                                    Receive detailed route descriptions and travel suggestions for your journey
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Solo or Group</h3>
                                <p className="text-muted-foreground">
                                    Perfect for solo travelers, bike gangs, or any group adventure
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Compass className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Local Recommendations</h3>
                                <p className="text-muted-foreground">
                                    Discover the best places to stay, eat, and explore at your destination
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
                        <CardContent className="py-16 text-center space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Ready to Start Your Adventure?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Join TripMate today and let us help you plan the perfect trip, 
                                from start to finish.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: '/planner' })}
                                className="text-lg px-8"
                            >
                                Plan Your Trip Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
