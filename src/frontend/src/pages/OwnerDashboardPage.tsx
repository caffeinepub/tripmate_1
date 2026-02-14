import { useState } from 'react';
import { useGetCallerPromotedListings, useDeletePromotedListing } from '../hooks/useListings';
import ListingFormDialog from '../components/listings/ListingFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pencil, Trash2, Loader2, Store } from 'lucide-react';
import type { PromotedListing } from '../backend';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function OwnerDashboardPage() {
    const { data: listings = [], isLoading } = useGetCallerPromotedListings();
    const deleteListing = useDeletePromotedListing();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<PromotedListing | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState<string | null>(null);

    const handleEdit = (listing: PromotedListing) => {
        setEditingListing(listing);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (listingToDelete) {
            await deleteListing.mutateAsync(listingToDelete);
            setDeleteDialogOpen(false);
            setListingToDelete(null);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingListing(null);
    };

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Business Dashboard</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your promoted listings and reach more travelers
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Add New Listing
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : listings.length === 0 ? (
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>No Listings Yet</CardTitle>
                        <CardDescription>
                            Create your first promoted listing to start reaching travelers
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => setDialogOpen(true)} size="lg">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Your First Listing
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Listings ({listings.length})</CardTitle>
                        <CardDescription>
                            Manage and update your promoted business listings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listings.map((listing) => (
                                        <TableRow key={listing.id}>
                                            <TableCell className="font-medium">{listing.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{listing.category}</Badge>
                                            </TableCell>
                                            <TableCell>{listing.destination}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(listing)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setListingToDelete(listing.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <ListingFormDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                editingListing={editingListing}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this listing? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
