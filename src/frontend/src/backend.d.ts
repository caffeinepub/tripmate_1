import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ItineraryItem {
    day: bigint;
    routeDescription: string;
    ownedBy: Principal;
    foodRecommendations: Array<string>;
    activities: Array<string>;
    staySuggestions: Array<string>;
}
export interface TripDetails {
    destination: string;
    tripType: string;
    endDate: Time;
    interests?: string;
    notes?: string;
    startDate: Time;
}
export type Time = bigint;
export interface PackingChecklist {
    ownedBy: Principal;
    items: Array<string>;
}
export interface TripPlan {
    tripDetails: TripDetails;
    packingChecklist: PackingChecklist;
    sponsoredSuggestions: Array<PromotedListing>;
    pType: Principal;
    itinerary: Array<ItineraryItem>;
}
export interface UserProfile {
    appRole: AppUserRole;
    name: string;
}
export interface PromotedListing {
    id: string;
    destination: string;
    contactInfo: string;
    owner: Principal;
    name: string;
    description: string;
    promoText?: string;
    category: string;
}
export enum AppUserRole {
    traveler = "traveler",
    business = "business"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(role: string, name: string): Promise<void>;
    createPromotedListing(listing: PromotedListing): Promise<void>;
    createTrip(trip: TripDetails): Promise<TripPlan>;
    deletePromotedListing(id: string): Promise<void>;
    filterPromotedListingsByCategory(category: string): Promise<Array<PromotedListing>>;
    getAllListingsSortedByName(): Promise<Array<PromotedListing>>;
    getAllPromotedListings(): Promise<Array<PromotedListing>>;
    getAllTripPlans(): Promise<Array<TripPlan>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getCallerPromotedListings(): Promise<Array<PromotedListing>>;
    getCallerTripPlans(): Promise<Array<TripPlan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePromotedListing(id: string, updatedListing: PromotedListing): Promise<void>;
}
