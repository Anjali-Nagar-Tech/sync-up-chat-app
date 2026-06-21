import User from "../models/User";
import Message from "../models/Message";

/**
 * SeedGuard — runs once on every server startup.
 *
 * Reads PROTECTED_USERS from env (comma-separated usernames).
 * Deletes every user NOT in that list, along with their messages.
 *
 * Set PROTECTED_USERS to include all real users before deploying.
 * New registrations are safe — add their username to PROTECTED_USERS
 * or leave SEED_GUARD_ENABLED=false to disable entirely.
 */
export const runSeedGuard = async (): Promise<void> => {
  // Allow disabling entirely via env
  if (process.env.SEED_GUARD_ENABLED === "false") {
    console.log("[SeedGuard] Disabled via SEED_GUARD_ENABLED=false");
    return;
  }

  try {
    const raw = process.env.PROTECTED_USERS ?? "";
    if (!raw.trim()) {
      console.log("[SeedGuard] No PROTECTED_USERS set — skipping cleanup.");
      return;
    }

    const protectedNames = raw
      .split(",")
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);

    // Find every user whose username is NOT in the protected list
    const staleUsers = await User.find({
      username: { $nin: protectedNames },
    });

    if (staleUsers.length === 0) {
      console.log("[SeedGuard] No unprotected users found.");
      return;
    }

    const staleIds = staleUsers.map((u) => u._id);

    // Remove their messages first (FK cleanup)
    const msgResult = await Message.deleteMany({
      $or: [
        { senderId: { $in: staleIds } },
        { receiverId: { $in: staleIds } },
      ],
    });

    // Remove the users
    await User.deleteMany({ _id: { $in: staleIds } });

    console.log(
      `[SeedGuard] Removed ${staleUsers.length} user(s): ${staleUsers
        .map((u) => u.username)
        .join(", ")} | Messages cleaned: ${msgResult.deletedCount}`
    );
  } catch (err: any) {
    console.error("[SeedGuard] Error:", err.message);
  }
};
