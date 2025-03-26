import { db } from "../../../db"
import { authProviders } from "../../../db/schema"
import { eq, and } from "drizzle-orm"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import { authenticateRequest, unauthorizedResponse } from "../../../utils/api-middleware"

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request)

    if (!auth) {
      return unauthorizedResponse()
    }

    const { provider, token } = await request.json()

    if (!provider || !token) {
      return Response.json({ error: "Provider and token are required" }, { status: 400 })
    }

    let providerId: string

    // Verify token and get provider ID
    if (provider === "google") {
      // Verify Google token
      const googleClient = new OAuth2Client(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID)
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload || !payload.sub) {
        return Response.json({ error: "Invalid Google token" }, { status: 400 })
      }

      providerId = payload.sub
    } else if (provider === "apple") {
      // Verify Apple token
      const decodedToken = jwt.decode(token) as any

      if (!decodedToken || !decodedToken.sub) {
        return Response.json({ error: "Invalid Apple token" }, { status: 400 })
      }

      providerId = decodedToken.sub
    } else {
      return Response.json({ error: "Unsupported provider" }, { status: 400 })
    }

    // Check if provider is already linked to another account
    const existingProvider = await db
      .select()
      .from(authProviders)
      .where(and(eq(authProviders.provider, provider), eq(authProviders.providerId, providerId)))
      .limit(1)

    if (existingProvider.length > 0 && existingProvider[0].userId !== auth.userId) {
      return Response.json({ error: "This account is already linked to another user" }, { status: 409 })
    }

    // Check if provider is already linked to this account
    const existingUserProvider = await db
      .select()
      .from(authProviders)
      .where(and(eq(authProviders.userId, auth.userId), eq(authProviders.provider, provider)))
      .limit(1)

    if (existingUserProvider.length > 0) {
      // Update provider ID
      await db.update(authProviders).set({ providerId }).where(eq(authProviders.id, existingUserProvider[0].id))
    } else {
      // Link provider to account
      await db.insert(authProviders).values({
        userId: auth.userId,
        provider,
        providerId,
      })
    }

    return Response.json({
      success: true,
      message: `Account linked with ${provider} successfully`,
    })
  } catch (error) {
    console.error("Account linking error:", error)
    return Response.json({ error: "An error occurred during account linking" }, { status: 500 })
  }
}

