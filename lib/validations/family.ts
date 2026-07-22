import { z } from "zod";

export const familySchema = z.object({
  familyName: z.string().min(2, "Family name must be at least 2 characters").max(100),
  motto: z.string().max(200).optional(),
  origin: z.string().max(100).optional(),
  established: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const memberSchema = z.object({
  treeId: z.string(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  nickname: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string(),
  dateOfDeath: z.string().optional(),
  isAlive: z.boolean().default(true),
  occupation: z.string().optional(),
  education: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});
