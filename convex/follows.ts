// convex/follows.ts

import { v } from "convex/values";
import { query } from "./_generated/server";

// Takipçileri getir
export const getFollowers = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", userId))
      .collect();

    const followers = await Promise.all(
      follows.map((f) => ctx.db.get(f.followerId))
    );

    return followers.filter(Boolean);
  },
});

// Takip edilenleri getir
export const getFollowing = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .collect();

    const following = await Promise.all(
      follows.map((f) => ctx.db.get(f.followingId))
    );

    return following.filter(Boolean);
  },
});
