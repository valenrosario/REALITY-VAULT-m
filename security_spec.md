# Security Specification - Reality Vault

## Data Invariants
1. A **User Profile** must have a unique UID matching their Firebase Auth UID.
2. A user can only modify their own profile.
3. Usernames must be between 1 and 30 characters.
4. Avatars must be valid URLs.
5. Favorites and WatchedEpisodes are optional lists with size limits.

## The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to create a user profile with a UID that doesn't match `request.auth.uid`.
2. **Username Overload**: Attempt to set a username longer than 30 characters.
3. **Empty Username**: Attempt to set an empty string as a username.
4. **Invalid Avatar**: Attempt to set a non-URL string as an avatar.
5. **Unauthorized Read**: Attempt to read another user's private data (if any PII is added later).
6. **Unauthorized Update**: Attempt to update another user's profile.
7. **Ghost Field Injection**: Adding an `isAdmin: true` field to a user profile during creation/update.
8. **Resource Exhaustion (Favorites)**: Attempt to add more than 100 favorites.
9. **Resource Exhaustion (Watched)**: Attempt to add more than 500 watched episodes.
10. **Bypassing Verification**: Attempting a write when `email_verified` is false (for paths that require it).
11. **ID Poisoning**: Using a 2KB string as a `userId` in the path.
12. **Tampering with Immutables**: Attempting to change the `uid` field of a user profile after creation.

## Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| users | BLOCKED (isOwner check) | N/A | BLOCKED (size checks on strings/lists) |

## Test Runner (Logic Check)
The `firestore.rules` will be validated using `eslint` and manual audit against these cases.
