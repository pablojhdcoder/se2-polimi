// ===================================
// Best Bike Paths (BBP) - Alloy Model
// ===================================

// ---------- Core Signatures ----------

// Abstract representation of a user in the system
abstract sig User {
    userId: one UserID,
    email: one Email,
    username: one Username
}

// A registered user who can record trips and publish paths
sig RegisteredUser extends User {
    trips: set Trip,              
    publishedPaths: set Path,     
    ratings: set Rating           
} {
    // Every registered user must have a unique email
    some email
}

// A non-registered user who can only browse paths
sig NonRegisteredUser extends User {}

// Represents a cycling trip recorded by a registered user
sig Trip {
    tripId: one TripID,
    path: one Path,                  
    startTime: one DateTime,
    endTime: one DateTime,
    distance: one Distance,         
    avgSpeed: one Speed,              
    weather: lone WeatherData        
} {
    // End time must be after start time
    dateTimeOrder[startTime, endTime]
}

// Represents a bike path with status and characteristics
sig Path {
    pathId: one PathID,
    origin: one Location,
    destination: one Location,
    streetNames: set StreetName,     
    status: one PathStatus,          
    length: one Distance,
    obstacles: set Obstacle,         
    isPublished: one Bool,           
    lastUpdated: one DateTime,       
    confirmedBy: set RegisteredUser  
}

// Represents an obstacle or pothole on a path
sig Obstacle {
    obstacleId: one ObstacleID,
    location: one Location,          
    detectionDate: one DateTime,
    isConfirmed: one Bool,           
    severity: one Severity           
}

// Weather information enriching trip data
sig WeatherData {
    weatherId: one WeatherID,
    temperature: one Temperature,
    windSpeed: one WindSpeed,
    condition: one WeatherCondition,
    timestamp: one DateTime
}

// Rating given by a user to a path
sig Rating {
    ratingId: one RatingID,
    path: one Path,                  
    user: one RegisteredUser,        
    score: one Score,                
    comment: lone Comment,           
    ratingDate: one DateTime
}

// ---------- Utility Signatures ----------

sig UserID, Email, Username, TripID, PathID, ObstacleID {}
sig WeatherID, RatingID, StreetName, Comment {}
sig Location, Distance, Speed, Temperature, WindSpeed, Score {}

// ---------- Enumerations ----------

enum PathStatus { OPTIMAL, MEDIUM, SUFFICIENT, REQUIRES_MAINTENANCE }
enum Severity { LOW, MODERATE, HIGH, CRITICAL }
enum WeatherCondition { SUNNY, CLOUDY, RAINY, WINDY, SNOWY }
enum Bool { TRUE, FALSE }

// DateTime represented as months for simplicity
abstract sig DateTime {}
one sig JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC extends DateTime {}

// ---------- Utility Functions ----------

// Assigns numerical index to each month for comparison
fun dateTimeIndex[dt: DateTime]: Int {
    dt = JAN => 1
    else dt = FEB => 2
    else dt = MAR => 3
    else dt = APR => 4
    else dt = MAY => 5
    else dt = JUN => 6
    else dt = JUL => 7
    else dt = AUG => 8
    else dt = SEP => 9
    else dt = OCT => 10
    else dt = NOV => 11
    else 12
}

// Validates that one datetime comes before another
pred dateTimeOrder[dt1, dt2: DateTime] {
    dateTimeIndex[dt1] < dateTimeIndex[dt2]
}

// ---------- Facts & Constraints ----------

// Ensures all user IDs are unique
fact UserIDsAreUnique {
    all disj u1, u2: User | u1.userId != u2.userId
}

// Ensures all emails are unique across users
fact EmailsAreUnique {
    all disj u1, u2: User | u1.email != u2.email
}

// System must have at least one registered user and one path
fact AtLeastOneOfEach {
    some RegisteredUser
    some Path
}

// Every trip must belong to exactly one registered user
fact TripOwnership {
    all t: Trip | one u: RegisteredUser | t in u.trips
}

// Every published path must belong to exactly one registered user
fact PathOwnership {
    all p: Path | p.isPublished = TRUE implies 
        one u: RegisteredUser | p in u.publishedPaths
}

// Every published path must have at least one confirming user
fact PublishedPathsHaveConfirmers {
    all p: Path | p.isPublished = TRUE implies some p.confirmedBy
}

// Obstacles must be associated with exactly one path
fact ObstaclePathRelationship {
    all o: Obstacle | one p: Path | o in p.obstacles
}

// Published paths must have valid status information
fact PublishedPathsHaveStatus {
    all p: Path | p.isPublished = TRUE implies some p.status
}

// Confirmed obstacles must have at least one confirming user
fact ConfirmedObstacleValidation {
    all o: Obstacle | o.isConfirmed = TRUE implies 
        some p: Path | o in p.obstacles and some p.confirmedBy
}

// Confirmed obstacles must be on published paths
fact ConfirmedObstaclesOnPublishedPaths {
    all o: Obstacle | o.isConfirmed = TRUE implies
        some p: Path | o in p.obstacles and p.isPublished = TRUE
}

// Every rating must belong to exactly one user
fact RatingOwnership {
    all r: Rating | one u: RegisteredUser | r in u.ratings
}

// A user cannot rate the same path multiple times
fact UniqueRatingsPerUserPath {
    all disj r1, r2: Rating |
        (r1.user = r2.user and r1.path = r2.path) implies r1 = r2
}

// Trips cannot be associated with unpublished paths unless 
// the trip owner is the path owner
fact TripPathConsistency {
    all t: Trip, u: RegisteredUser | 
        t in u.trips and t.path.isPublished = FALSE implies
        t.path in u.publishedPaths
}

// Weather data timestamp should align with trip time
fact WeatherDataConsistency {
    all t: Trip | some t.weather implies
        t.weather.timestamp = t.startTime or 
        t.weather.timestamp = t.endTime
}

// Paths must have different origin and destination
fact ValidPathLocations {
    all p: Path | p.origin != p.destination
}

// Ratings must be for published paths only
fact RatingsForPublishedPaths {
    all r: Rating | r.path.isPublished = TRUE
}

// Path status updates from multiple users: if multiple users confirm
// a path, the most recent status should be reflected
fact PathStatusReflectsConsensus {
    all p: Path | #p.confirmedBy > 1 implies some p.lastUpdated
}

// ---------- Simple Run Command ----------

// Generates an instance of the model
run {} for 5

// ---------- Assertions ----------

// Assertion 1: All trips belong to registered users
assert AllTripsHaveOwners {
    all t: Trip | some u: RegisteredUser | t in u.trips
}
check AllTripsHaveOwners for 5

// Assertion 2: Published paths must have at least one confirming user
assert PublishedPathsHaveConfirmers {
    all p: Path | p.isPublished = TRUE implies some p.confirmedBy
}
check PublishedPathsHaveConfirmers for 5

// Assertion 3: No duplicate ratings from same user to same path
assert NoDuplicateRatings {
    all disj r1, r2: Rating |
        r1.user = r2.user and r1.path = r2.path implies r1 = r2
}
check NoDuplicateRatings for 5

// Assertion 4: Confirmed obstacles belong to valid paths
assert ConfirmedObstaclesOnValidPaths {
    all o: Obstacle | o.isConfirmed = TRUE implies
        some p: Path | o in p.obstacles and p.isPublished = TRUE
}
check ConfirmedObstaclesOnValidPaths for 5

// Assertion 5: Trip end time is always after start time
assert ValidTripTimes {
    all t: Trip | dateTimeIndex[t.startTime] < dateTimeIndex[t.endTime]
}
check ValidTripTimes for 5

// Assertion 6: Users cannot rate their own unpublished paths
assert NoSelfRatingUnpublished {
    all r: Rating | r.path.isPublished = FALSE implies
        not (r.path in r.user.publishedPaths)
}
check NoSelfRatingUnpublished for 5

// Assertion 7: All ratings are associated with existing users
assert AllRatingsHaveUsers {
    all r: Rating | some u: RegisteredUser | r in u.ratings
}
check AllRatingsHaveUsers for 5

// ---------- Scenarios & Predicates ----------

/**
 * Scenario 1: A registered user records a trip with weather data
 * This scenario demonstrates the core functionality of trip recording
 * with weather enrichment from external services.
 */
pred UserRecordsTripWithWeather {
    some u: RegisteredUser, t: Trip |
        t in u.trips
        and some t.weather
        and t.path.isPublished = TRUE
}
run UserRecordsTripWithWeather for 5

/**
 * Scenario 2: Multiple users confirm the same path
 * This demonstrates the path validation and consensus mechanism.
 */
pred MultipleUsersConfirmPath {
    some p: Path |
        #p.confirmedBy > 1
        and p.isPublished = TRUE
}
run MultipleUsersConfirmPath for 5

/**
 * Scenario 3: User detects and confirms obstacles on a path
 * This shows the automated obstacle detection and confirmation workflow.
 */
pred ObstacleDetectionAndConfirmation {
    some p: Path, o: Obstacle |
        o in p.obstacles
        and o.isConfirmed = TRUE
        and some p.confirmedBy
}
run ObstacleDetectionAndConfirmation for 5

/**
 * Scenario 4: User rates a published path
 * Demonstrates the rating system for community feedback.
 */
pred UserRatesPublishedPath {
    some r: Rating, u: RegisteredUser |
        r in u.ratings
        and r.path.isPublished = TRUE
        and some r.score
}
run UserRatesPublishedPath for 5

/**
 * Scenario 5: Path with multiple obstacles and different severity levels
 * Shows how the system handles paths with various obstacles.
 */
pred PathWithMultipleObstacles {
    some p: Path |
        #p.obstacles > 1
        and p.isPublished = TRUE
        and (some o: p.obstacles | o.severity = HIGH or o.severity = CRITICAL)
}
run PathWithMultipleObstacles for 5

/**
 * Scenario 6: User takes multiple trips on the same path
 * Demonstrates tracking of repeated trips by users.
 */
pred MultipleTripsOnSamePath {
    some u: RegisteredUser, p: Path |
        #(u.trips & path.p) > 1
}
run MultipleTripsOnSamePath for 5
