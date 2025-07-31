import { v } from "convex/values";
import { useTranslation } from "react-i18next";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

const { t } = useTranslation();

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .order("desc")
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await ctx.db.get(notification.senderId);

        let post = null;
        let comment = null;

        if (notification.postId) {
          post = await ctx.db.get(notification.postId);
        }

        if (notification.type === "comment" && notification.commentId) {
          comment = await ctx.db.get(notification.commentId);
        }

        return {
          ...notification,
          sender: sender
            ? {
                _id: sender._id,
                username: sender.username,
                image: sender.image,
              }
            : {
                _id: null,
                username: t("notifications.unknownUser"),
                image: null,
              },
          post,
          comment: comment?.content,
        };
      })
    );

    return notificationsWithInfo;
  },
});


export const deleteNotification = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});