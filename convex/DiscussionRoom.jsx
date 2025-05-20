import { mutation } from "./_generated/server";
import { v } from "convex/values"; // ✅ Missing import added

export const CreateNewRoom = mutation({
  args: {
    coachingOptions: v.string(), // ✅ Fixed name to match frontend
    topic: v.string(),
    expertName: v.string(),      // ✅ Fixed typo
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("DiscussionRoom", {
      coachingOptions: args.coachingOptions,
      topic: args.topic,
      expertName: args.expertName,
    });
    return result;
  },
});
