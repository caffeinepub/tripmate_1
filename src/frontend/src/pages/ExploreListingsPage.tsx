import { useState } from 'react';
import { useGetAllPromotedListings } from '../hooks/useListings';
import ListingsFilters from '../components/listings/ListingsFilters';
import ListingCard from '../components/listings/ListingCard';
import { Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExploreListingsPage() {
    const { data: listings = [], isLoading } = useGetAllPromotedListings();
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [destinationFilter, setDestinationFilter] = useState<string>('');

    const filteredListings = listings.filter((listing) => {
        const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
        const matchesDestination =
            !destinationFilter ||
            listing.destination.toLowerCase().includes(destinationFilter.toLowerCase()) ||
            listing.name.toLowerCase().includes(destinationFilter.toLowerCase());
        return matchesCategory && matchesDestination;
    });

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Destinations</h1>
                <p className="text-muted-foreground text-lg">
                    Discover amazing places to stay, eat, and visit for your next adventure
                </p>
            </div>

            <div className="mb-8">
                <ListingsFilters
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    destinationFilter={destinationFilter}
                    onDestinationChange={setDestinationFilter}
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredListings.length === 0 ? (
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle>No Listings Found</CardTitle>
                        <CardDescription>
                            {listings.length === 0
                                ? 'No promoted listings are available yet. Check back soon!'
                                : 'Try adjusting your filters to see more results.'}
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}
