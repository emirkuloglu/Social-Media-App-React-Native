import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const addProfileVisit = mutation({
  args: {
    visitorClerkId: v.string(),
    visitedUserId: v.string(),
    visitedUsername: v.string(),
    visitedFullname: v.string(),
    visitedImage: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
        .query("profileVisits")
        .withIndex("byVisitorVisited", (q) =>
            q.eq("visitorClerkId", args.visitorClerkId).eq("visitedUserId", args.visitedUserId)
        )
        .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    await ctx.db.insert("profileVisits", {
      visitorClerkId: args.visitorClerkId,
      visitedUserId: args.visitedUserId,
      visitedUsername: args.visitedUsername,
      visitedFullname: args.visitedFullname,
      visitedImage: args.visitedImage,
      visitedAt: Date.now(),
    });
  },
});

export const getProfileVisits = query({
  args: { visitorClerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profileVisits")
      .withIndex("byVisitorVisited", (q) => q.eq("visitorClerkId", args.visitorClerkId))
      .order("desc")
      .take(20);
  },
});