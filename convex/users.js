import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const userData = await ctx.db.query('users')
            .filter(q => q.eq(q.field('email'), args.email))
            .collect();
        // Check if user already exists
        if (userData.length == 0) {
            const data = {
                name: args.name,
                email: args.email,
                credits: 50000
            }
            const result = await ctx.db.insert('users', { ...data });
          
            return data;
        }
        return userData[0];
    }
});
