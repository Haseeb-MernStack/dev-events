import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event, { IEvent } from "@/database/event.model";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};


// GET /api/events/[slug] - Fetch event by slug - or i say fetch single event details by id
export async function GET(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        // connect to database
        await connectDB();

        // Await and extract slug from params
        const { slug } = await params;

        // Validate slug parameter
        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            return NextResponse.json(
                { error: "Invalid or missing slug parameter" },
                { status: 400 }
            );
        }

        // sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase();

        // Query event by slug
        const event = await Event.findOne<IEvent>({ slug: sanitizedSlug }).lean();

        // Handle event not found
        if (!event) {
            return NextResponse.json(
                { error: `Event with slug '${sanitizedSlug}' not found` },
                { status: 404 }
            );
        }

        // Return successful response with event data
        return NextResponse.json(
            { message: "Event fetched successfully", event },
            { status: 200 }
        );

    } catch (error) {
        // log error for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching event:", error);
        }

        // handle specific error types
        if (error instanceof Error) {
            // handle database connection errors
            if (error.message.includes("MONGODB_URI")) {
                return NextResponse.json({
                    error: "Database configuration error"
                }, { status: 500 });
            }
        }

        // return generic error with error message
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
