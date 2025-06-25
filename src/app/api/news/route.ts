import { getAllPosts } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const allPosts = await getAllPosts();

    // If getAllPosts could potentially throw an error not caught internally (though we made it robust)
    // or if there were other await calls here, this try-catch would be more critical.
    // Given getAllPosts now filters out nulls and handles its own errors,
    // this top-level try-catch primarily guards against unexpected issues in this route handler itself.

    return NextResponse.json(allPosts);

  } catch (error) {
    console.error("Error in /api/news route:", error);
    // Determine an appropriate error response
    // If error is an instance of a specific error type, you might customize the status code
    return NextResponse.json(
      { message: "Failed to fetch news articles. Please try again later." },
      { status: 500 }
    );
  }
}

// Optional: Handle other methods if needed, or return 405 Method Not Allowed
export async function POST() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
