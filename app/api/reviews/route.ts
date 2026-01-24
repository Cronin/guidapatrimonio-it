import { NextRequest, NextResponse } from "next/server";

// Types
interface Review {
  id: string;
  rating: number;
  name?: string;
  comment?: string;
  tool: string;
  createdAt: string;
  verified: boolean;
}

interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
  ratingCount: number;
}

interface ReviewsData {
  reviews: Review[];
  aggregate: AggregateRating;
  lastUpdated: string;
}

// In-memory storage (will reset on cold start, but good for MVP)
let reviewsStore: ReviewsData | null = null;

// Seed reviews - minimal to start
const seedReviews: Review[] = [
  { id: "seed-1", rating: 5, name: "Marco T.", comment: "Ottimo per pianificare la successione.", tool: "successione", createdAt: "2026-01-15T10:30:00Z", verified: true },
  { id: "seed-2", rating: 4, name: "Laura B.", comment: "Calcolo interesse composto preciso.", tool: "interesse-composto", createdAt: "2026-01-12T09:15:00Z", verified: true },
  { id: "seed-3", rating: 5, name: "Paolo M.", comment: "Mi ha aiutato a capire quanto mettere da parte.", tool: "fire", createdAt: "2026-01-10T10:00:00Z", verified: true },
  { id: "seed-4", rating: 4, name: "Francesca R.", tool: "patrimonio-netto", createdAt: "2026-01-08T11:00:00Z", verified: true },
  { id: "seed-5", rating: 5, name: "Michele S.", comment: "Simulatore Monte Carlo molto utile.", tool: "simulatore-monte-carlo", createdAt: "2026-01-05T16:30:00Z", verified: true },
];

// Calculate aggregate
function calculateAggregate(reviews: Review[]): AggregateRating {
  if (reviews.length === 0) {
    return { ratingValue: 0, reviewCount: 0, ratingCount: 0 };
  }
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    ratingValue: Math.round((totalRating / reviews.length) * 10) / 10,
    reviewCount: reviews.filter((r) => r.comment).length,
    ratingCount: reviews.length,
  };
}

// Default data
function getDefaultData(): ReviewsData {
  return {
    reviews: seedReviews,
    aggregate: calculateAggregate(seedReviews),
    lastUpdated: new Date().toISOString(),
  };
}

// GET - Retrieve reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tool = searchParams.get("tool");

    const data = reviewsStore || getDefaultData();

    let filteredReviews = data.reviews;
    if (tool) {
      filteredReviews = data.reviews.filter((r) => r.tool === tool);
    }

    const aggregate = calculateAggregate(filteredReviews);

    return NextResponse.json({
      success: true,
      reviews: filteredReviews.slice(0, 10),
      aggregate,
      total: filteredReviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Add a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, name, comment, tool, fingerprint } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!tool) {
      return NextResponse.json(
        { success: false, error: "Tool name is required" },
        { status: 400 }
      );
    }

    // Initialize store if needed
    if (!reviewsStore) {
      reviewsStore = getDefaultData();
    }

    // Check for duplicate (same fingerprint + tool in last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const isDuplicate = reviewsStore.reviews.some(
      (r) =>
        r.id.includes(fingerprint || "") &&
        r.tool === tool &&
        r.createdAt > oneDayAgo
    );

    if (isDuplicate) {
      return NextResponse.json(
        { success: false, error: "Hai gia valutato questo strumento" },
        { status: 429 }
      );
    }

    // Create new review
    const newReview: Review = {
      id: `${Date.now()}-${fingerprint || Math.random().toString(36).slice(2)}`,
      rating: Math.round(rating),
      name: name?.trim().slice(0, 100) || undefined,
      comment: comment?.trim().slice(0, 500) || undefined,
      tool,
      createdAt: new Date().toISOString(),
      verified: false,
    };

    // Add review
    reviewsStore.reviews.unshift(newReview);

    // Keep only last 500 reviews
    if (reviewsStore.reviews.length > 500) {
      reviewsStore.reviews = reviewsStore.reviews.slice(0, 500);
    }

    // Update aggregate
    reviewsStore.aggregate = calculateAggregate(reviewsStore.reviews);
    reviewsStore.lastUpdated = new Date().toISOString();

    return NextResponse.json({
      success: true,
      review: newReview,
      aggregate: reviewsStore.aggregate,
    });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save review" },
      { status: 500 }
    );
  }
}
