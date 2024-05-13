import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Get the file info from the URL
  const { file_path, file_name, mime_type } = Object.fromEntries(
    req.nextUrl.searchParams
  )

  // Fetch the file
  const fileResponse = await fetch(file_path)

  // Handle the case where the file could not be fetched
  if (!fileResponse.ok) {
    return new NextResponse("File not found", { status: 404 })
  }

  // Get the file content as a buffer
  const fileBuffer = await fileResponse.arrayBuffer()

  // Define response headers
  const headers = {
    "Content-Type": mime_type,
    // This sets the file name for the download
    "Content-Disposition": `attachment; filename="${file_name}"`,
  }

  // Create a NextResponse with the file content and headers
  const response = new NextResponse(fileBuffer, {
    status: 200,
    headers,
  })

  return response
}
