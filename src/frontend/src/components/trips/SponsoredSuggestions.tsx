import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Info } from 'lucide-react';
import type { PromotedListing } from '../../backend';

interface SponsoredSuggestionsProps {
    destination: string;
    sponsoredListings: PromotedListing[];
}

export default function SponsoredSuggestions({ destination, sponsoredListings }: SponsoredSuggestionsProps) {
    const matchingListings = sponsoredListings.filter((listing) =>
        listing.destination.toLowerCase().includes(destination.toLowerCase()) ||
        destination.toLowerCase().includes(listing.destination.toLowerCase())
    );

    if (matchingListings.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Sponsored Suggestions
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingListings.map((listing) => (
                    <Card key={listing.id} className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg">{listing.name}</CardTitle>
                                <Badge variant="secondary" className="shrink-0">
                                    {listing.category}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {listing.destination}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">{listing.description}</p>
                            {listing.promoText && (
                                <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5">
                                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm text-primary">{listing.promoText}</p>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {listing.contactInfo}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
