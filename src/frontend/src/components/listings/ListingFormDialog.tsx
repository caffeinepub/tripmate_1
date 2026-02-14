import { useState, useEffect } from 'react';
import { useCreatePromotedListing, useUpdatePromotedListing } from '../../hooks/useListings';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { PromotedListing } from '../../backend';

interface ListingFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingListing?: PromotedListing | null;
}

export default function ListingFormDialog({ open, onOpenChange, editingListing }: ListingFormDialogProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('hotel');
    const [destination, setDestination] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [promoText, setPromoText] = useState('');

    const createListing = useCreatePromotedListing();
    const updateListing = useUpdatePromotedListing();

    useEffect(() => {
        if (editingListing) {
            setName(editingListing.name);
            setCategory(editingListing.category);
            setDestination(editingListing.destination);
            setDescription(editingListing.description);
            setContactInfo(editingListing.contactInfo);
            setPromoText(editingListing.promoText || '');
        } else {
            setName('');
            setCategory('hotel');
            setDestination('');
            setDescription('');
            setContactInfo('');
            setPromoText('');
        }
    }, [editingListing, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const listing: PromotedListing = {
            id: editingListing?.id || `listing-${Date.now()}`,
            name,
            category,
            destination,
            description,
            contactInfo,
            promoText: promoText || undefined,
            owner: editingListing?.owner || ('' as any),
        };

        if (editingListing) {
            await updateListing.mutateAsync({ id: editingListing.id, listing });
        } else {
            await createListing.mutateAsync(listing);
        }

        onOpenChange(false);
    };

    const isValid = name && category && destination && description && contactInfo;
    const isPending = createListing.isPending || updateListing.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingListing ? 'Edit Listing' : 'Create New Listing'}</DialogTitle>
                    <DialogDescription>
                        {editingListing
                            ? 'Update your promoted listing details'
                            : 'Add a new promoted listing to reach more travelers'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Sunset Resort"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hotel">Hotel</SelectItem>
                                    <SelectItem value="resort">Resort</SelectItem>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                    <SelectItem value="tourist place">Tourist Place</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="destination">Destination/Area *</Label>
                        <Input
                            id="destination"
                            placeholder="e.g., Bali, Indonesia"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your business and what makes it special..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactInfo">Contact Information *</Label>
                        <Input
                            id="contactInfo"
                            placeholder="Phone, email, or website"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="promoText">Promotional Text (Optional)</Label>
                        <Input
                            id="promoText"
                            placeholder="e.g., 20% off for TripMate users!"
                            value={promoText}
                            onChange={(e) => setPromoText(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isValid || isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {editingListing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : editingListing ? (
                                'Update Listing'
                            ) : (
                                'Create Listing'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
