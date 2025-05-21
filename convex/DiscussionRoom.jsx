import { mutation, query } from "./_generated/server";
import { v } from "convex/values"; // ✅ Missing import added

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(), // ✅ Fixed name to match frontend
    topic: v.string(),
    expertName: v.string(),      // ✅ Fixed typo
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("DiscussionRoom", {
      coachingOption: args.coachingOption,
      topic: args.topic,
      expertName: args.expertName,
    });
    return result;
  },

});

export const GetDiscussionRoom = query({
  args: {
    id:v.id('DiscussionRoom')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  },
})
