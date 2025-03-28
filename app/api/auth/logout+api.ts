import { db } from "../../../db"
import { sessions } from "../../../db/schema"
import { verifyJWT } from "../../../utils/auth"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyJWT(token)

    if (!payload || !payload.sessionToken) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    // Delete session
    await db.delete(sessions).where(eq(sessions.token, payload.sessionToken))

    return Response.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return Response.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

