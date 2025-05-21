import { defineSchema, defineTable } from "convex/server";
import { use } from "react";
import { v } from "convex/values";
import { SubscriptIcon } from "lucide-react";
import { CoachingOptions } from "@/services/Option";
export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    Subscription: v.optional(v.string()), 
  }),
  DiscussionRoom: defineTable({
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),               
    conversation: v.optional(v.any())
  }),
});
