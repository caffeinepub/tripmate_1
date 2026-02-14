import { useState } from 'react';
import { useCreateTrip } from '../../hooks/useTrips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { TripDetails, TripPlan } from '../../backend';

interface TripDetailsFormProps {
    onSuccess?: (tripPlan: TripPlan) => void;
}

export default function TripDetailsForm({ onSuccess }: TripDetailsFormProps) {
    const [tripType, setTripType] = useState<string>('solo');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
    const [interests, setInterests] = useState('');

    const createTrip = useCreateTrip();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tripDetails: TripDetails = {
            tripType,
            destination,
            startDate: BigInt(new Date(startDate).getTime() * 1_000_000),
            endDate: BigInt(new Date(endDate).getTime() * 1_000_000),
            notes: notes || undefined,
            interests: interests || undefined,
        };

        const result = await createTrip.mutateAsync(tripDetails);
        if (onSuccess) {
            onSuccess(result);
        }
    };

    const isValid = destination && startDate && endDate && new Date(endDate) >= new Date(startDate);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select value={tripType} onValueChange={setTripType}>
                        <SelectTrigger id="tripType">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="solo">Solo Trip</SelectItem>
                            <SelectItem value="group">Group Trip</SelectItem>
                            <SelectItem value="bike gang">Bike Gang Trip</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                        id="destination"
                        placeholder="e.g., Paris, France"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="interests">Interests (Optional)</Label>
                <Input
                    id="interests"
                    placeholder="e.g., hiking, photography, local cuisine"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                    id="notes"
                    placeholder="Any special requirements or preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={!isValid || createTrip.isPending}>
                {createTrip.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Your Trip Plan...
                    </>
                ) : (
                    'Generate Trip Plan'
                )}
            </Button>
        </form>
    );
}
