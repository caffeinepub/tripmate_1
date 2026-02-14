import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Info } from 'lucide-react';
import type { PromotedListing } from '../../backend';

interface ListingCardProps {
    listing: PromotedListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    return (
        <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{listing.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                        {listing.category}
                    </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.destination}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{listing.description}</p>
                {listing.promoText && (
                    <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/10">
                        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-primary font-medium">{listing.promoText}</p>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <Phone className="h-4 w-4" />
                    {listing.contactInfo}
                </div>
            </CardContent>
        </Card>
    );
}
