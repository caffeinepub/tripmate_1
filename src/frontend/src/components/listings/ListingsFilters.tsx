import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ListingsFiltersProps {
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    destinationFilter: string;
    onDestinationChange: (value: string) => void;
}

export default function ListingsFilters({
    categoryFilter,
    onCategoryChange,
    destinationFilter,
    onDestinationChange,
}: ListingsFiltersProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={onCategoryChange}>
                    <SelectTrigger id="category">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="hotel">Hotels</SelectItem>
                        <SelectItem value="resort">Resorts</SelectItem>
                        <SelectItem value="restaurant">Restaurants</SelectItem>
                        <SelectItem value="tourist place">Tourist Places</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="destination">Search Destination</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="destination"
                        placeholder="Search by destination or name..."
                        value={destinationFilter}
                        onChange={(e) => onDestinationChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
        </div>
    );
}
