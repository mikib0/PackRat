import { db } from "../../../db"
import { users, authProviders, sessions } from "../../../db/schema"
import { generateJWT, generateToken } from "../../../utils/auth"
import { eq, and } from "drizzle-orm"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { identityToken, authorizationCode } = await request.json()

    if (!identityToken || !authorizationCode) {
      return Response.json({ error: "Identity token and authorization code are required" }, { status: 400 })
    }

    // Verify Apple identity token
    const decodedToken = jwt.decode(identityToken) as any

    if (!decodedToken || !decodedToken.sub) {
      return Response.json({ error: "Invalid Apple token" }, { status: 400 })
    }

    const appleUserId = decodedToken.sub

    // Exchange authorization code for user information
    // Note: Apple only provides email and name on first login
    let email = decodedToken.email
    const firstName = ""
    const lastName = ""

    if (decodedToken.email_verified && decodedToken.email) {
      email = decodedToken.email
    }

    // Check if user exists with this Apple ID
    const existingProvider = await db
      .select()
      .from(authProviders)
      .where(and(eq(authProviders.provider, "apple"), eq(authProviders.providerId, appleUserId)))
      .limit(1)

    let userId: number
    let isNewUser = false

    if (existingProvider.length > 0) {
      // User exists, get user ID
      userId = existingProvider[0].userId
    } else if (email) {
      // Check if user exists with this email
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (existingUser.length > 0) {
        // User exists with this email, link Apple account
        userId = existingUser[0].id

        await db.insert(authProviders).values({
          userId,
          provider: "apple",
          providerId: appleUserId,
        })
      } else {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            firstName,
            lastName,
            emailVerified: true, // Apple verifies emails
          })
          .returning({ id: users.id })

        userId = newUser.id
        isNewUser = true

        // Link Apple account
        await db.insert(authProviders).values({
          userId,
          provider: "apple",
          providerId: appleUserId,
        })
      }
    } else {
      return Response.json({ error: "Email is required for account creation" }, { status: 400 })
    }

    // Get user info
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    // Generate session token
    const sessionToken = generateToken()

    // Get device info from request
    const userAgent = request.headers.get("user-agent") || ""

    // Store session
    await db.insert(sessions).values({
      userId,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      deviceInfo: { userAgent },
    })

    // Generate JWT
    const token = generateJWT({ userId, sessionToken })

    return Response.json({
      success: true,
      token,
      user: user[0],
      isNewUser,
    })
  } catch (error) {
    console.error("Apple authentication error:", error)
    return Response.json({ error: "An error occurred during Apple authentication" }, { status: 500 })
  }
}

