import { defineSchema, defineTable } from "convex/server";
import { use } from "react";
import { v } from "convex/values";
import { SubscriptIcon } from "lucide-react";
export default defineSchema({
    users:defineTable({
        name:v.string(),
        email:v.string(),
        credits:v.number(),
        Subscription:v.optional(v.string())
    })
})