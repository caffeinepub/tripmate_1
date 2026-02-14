import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type AppUserRole = {
    #traveler;
    #business;
  };

  public type UserProfile = {
    appRole : AppUserRole;
    name : Text;
  };

  public type TripDetails = {
    tripType : Text;
    destination : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    notes : ?Text;
    interests : ?Text;
  };

  public type ItineraryItem = {
    day : Nat;
    activities : [Text];
    routeDescription : Text;
    staySuggestions : [Text];
    foodRecommendations : [Text];
    ownedBy : Principal;
  };

  public type PackingChecklist = {
    items : [Text];
    ownedBy : Principal;
  };

  public type PromotedListing = {
    id : Text;
    name : Text;
    category : Text;
    destination : Text;
    description : Text;
    contactInfo : Text;
    promoText : ?Text;
    owner : Principal;
  };

  module PromotedListing {
    public func compare(l1 : PromotedListing, l2 : PromotedListing) : Order.Order {
      Text.compare(l1.name, l2.name);
    };
  };

  public type TripPlan = {
    tripDetails : TripDetails;
    itinerary : [ItineraryItem];
    packingChecklist : PackingChecklist;
    sponsoredSuggestions : [PromotedListing];
    pType : Principal;
  };

  module TripPlan {
    public func compare(p1 : TripPlan, p2 : TripPlan) : Order.Order {
      Text.compare(p1.tripDetails.destination, p2.tripDetails.destination);
    };
  };

  // State
  let tripPlans = Map.empty<Principal, List.List<TripPlan>>();
  let listings = Map.empty<Principal, List.List<PromotedListing>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent AccessControl state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper functions
  func getAppUserRole(caller : Principal) : AppUserRole {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.appRole };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  func generateItinerary(details : TripDetails, owner : Principal) : [ItineraryItem] {
    let dayCount = (details.endDate - details.startDate) / 86400000000000;
    let days = dayCount.toNat();
    if (days == 0) {
      return [];
    };
    Array.tabulate<ItineraryItem>(
      days,
      func(day) {
        {
          day = day + 1;
          activities = if (details.tripType == "solo") {
            ["Explore ", "Visit local markets ", "Try new cuisine "].map(func(a) { a # details.destination });
          } else {
            ["Group rides ", "Team building ", "Local tours"].map(func(a) { a # details.destination });
          };
          routeDescription = "Suggested routes based on interests and trip type";
          staySuggestions = if (details.tripType == "solo") {
            ["Budget hotels", "Boutique hostels"];
          } else {
            ["Lodges", "Resorts"];
          };
          foodRecommendations = if (details.tripType == "solo") {
            ["Affordable local eateries"];
          } else {
            ["Group-friendly restaurants"];
          };
          ownedBy = owner;
        };
      },
    );
  };

  func generatePackingChecklist(details : TripDetails, owner : Principal) : PackingChecklist {
    let items = if (details.tripType == "solo") {
      ["Essential clothing", "Toiletries", "Travel docs"];
    } else {
      ["Group gear", "Safety items", "Shared supplies"];
    };
    { items; ownedBy = owner };
  };

  // User Profile Methods (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Additional profile management
  public shared ({ caller }) func createProfile(role : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create profiles");
    };

    let appRole = switch (role) {
      case ("traveler") { #traveler };
      case ("business") { #business };
      case (_) { Runtime.trap("Invalid role. Must be 'traveler' or 'business'") };
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };

    let profile : UserProfile = {
      appRole;
      name;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.toArray();
  };

  // Trip Management
  public shared ({ caller }) func createTrip(trip : TripDetails) : async TripPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create trips");
    };

    let appRole = getAppUserRole(caller);
    switch (appRole) {
      case (#traveler) {
        let itinerary = generateItinerary(trip, caller);
        let checklist = generatePackingChecklist(trip, caller);

        let allListings = listings.values().toArray().map(
          func(list) { list.toArray() }
        ).flatten().sliceToArray(0, 3);

        let newTrip : TripPlan = {
          tripDetails = trip;
          itinerary;
          packingChecklist = checklist;
          sponsoredSuggestions = allListings;
          pType = caller;
        };

        let userTrips = switch (tripPlans.get(caller)) {
          case (?existing) { existing };
          case (null) { List.empty<TripPlan>() };
        };
        userTrips.add(newTrip);
        tripPlans.add(caller, userTrips);

        newTrip;
      };
      case (_) { Runtime.trap("Only travelers can create trips") };
    };
  };

  public query ({ caller }) func getCallerTripPlans() : async [TripPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view trips");
    };

    switch (tripPlans.get(caller)) {
      case (?trips) { trips.toArray().sort() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllTripPlans() : async [TripPlan] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all trips");
    };
    tripPlans.values().toArray().map(
      func(list) { list.toArray() }
    ).flatten();
  };

  // Promoted Listings Management
  public shared ({ caller }) func createPromotedListing(listing : PromotedListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create listings");
    };

    let appRole = getAppUserRole(caller);
    switch (appRole) {
      case (#business) {
        let userListings = switch (listings.get(caller)) {
          case (?existing) { existing };
          case (null) { List.empty<PromotedListing>() };
        };
        let newListing = { listing with owner = caller };
        userListings.add(newListing);
        listings.add(caller, userListings);
      };
      case (_) { Runtime.trap("Only business users can create listings") };
    };
  };

  public shared ({ caller }) func updatePromotedListing(id : Text, updatedListing : PromotedListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update listings");
    };

    let appRole = getAppUserRole(caller);
    switch (appRole) {
      case (#business) {
        switch (listings.get(caller)) {
          case (?userListings) {
            let updatedListings = userListings.map<PromotedListing, PromotedListing>(
              func(listing) {
                if (listing.id == id and listing.owner == caller) {
                  { updatedListing with owner = caller };
                } else {
                  listing;
                };
              }
            );
            listings.add(caller, updatedListings);
          };
          case (null) { Runtime.trap("Listing not found") };
        };
      };
      case (_) { Runtime.trap("Only business users can update listings") };
    };
  };

  public shared ({ caller }) func deletePromotedListing(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete listings");
    };

    let appRole = getAppUserRole(caller);
    switch (appRole) {
      case (#business) {
        switch (listings.get(caller)) {
          case (?userListings) {
            let filteredListings = userListings.filter(
              func(listing) {
                listing.id != id or listing.owner != caller;
              }
            );
            listings.add(caller, filteredListings);
          };
          case (null) { Runtime.trap("Listing not found") };
        };
      };
      case (_) { Runtime.trap("Only business users can delete listings") };
    };
  };

  // Public listing queries (available to all users including guests)
  public query ({ caller }) func getAllPromotedListings() : async [PromotedListing] {
    listings.values().toArray().map(
      func(list) { list.toArray() }
    ).flatten();
  };

  public query ({ caller }) func getCallerPromotedListings() : async [PromotedListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their listings");
    };

    switch (listings.get(caller)) {
      case (?listings) { listings.toArray().sort() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func filterPromotedListingsByCategory(category : Text) : async [PromotedListing] {
    let allListings = listings.values().toArray().map(
      func(list) { list.toArray() }
    ).flatten();
    allListings.filter(
      func(listing) {
        listing.category == category;
      }
    );
  };

  public query ({ caller }) func getAllListingsSortedByName() : async [PromotedListing] {
    listings.values().toArray().map(
      func(list) { list.toArray() }
    ).flatten();
  };
};
