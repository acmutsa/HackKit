# MyMLH OAuth Setup

This guide explains how to add MyMLH as a login option for your HackKit instance using Clerk's custom OAuth provider feature.

## Prerequisites

- A configured Clerk application for your HackKit instance
- Access to the Clerk Dashboard

## Step 1: Create a MyMLH Application

1. Go to [MyMLH Developer Portal](https://my.mlh.io/developers)
2. Sign in or create an MLH account
3. Click **Create New Application**
4. Fill in your application details:
   - **Application Name**: Your hackathon name
   - **Callback URL**: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback` (get this from Clerk after creating the provider)
5. Save and note your **Client ID** and **Client Secret**

## Step 2: Configure Clerk Custom OAuth Provider

1. Open your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Configure** → **SSO connections**
3. Click **Add connection** → **Custom provider**
4. Configure the provider:

| Field | Value |
|-------|-------|
| Name | `MyMLH` |
| Key | `mymlh` |
| Discovery Endpoint | `https://my.mlh.io/.well-known/openid-configuration` |
| Client ID | Your MyMLH Client ID |
| Client Secret | Your MyMLH Client Secret |

5. After creating, copy the **Authorized redirect URI** from Clerk
6. Go back to your MyMLH application settings and add this URI as a Callback URL

## Step 3: Configure Scopes

In the Clerk provider settings, enable the following scopes:

### Recommended Scopes

| Scope | Description |
|-------|-------------|
| `public` | Basic public information (required) |
| `offline_access` | Enables refresh tokens for keeping data updated |
| `user:read:profile` | Name, profile photo |
| `user:read:email` | Email address |
| `user:read:education` | School, major, graduation year |
| `user:read:demographics` | Age, gender, race/ethnicity |
| `user:read:address` | Shipping address (for swag) |
| `user:read:event_preferences` | Dietary restrictions, shirt size |
| `user:read:phone` | Phone number |
| `user:read:social_profiles` | GitHub, LinkedIn, etc. |
| `user:read:birthday` | Date of birth |
| `user:read:employment` | Employment history |

### Minimal Scopes (if you only need basics)

```
public user:read:profile user:read:email
```

## Step 4: Attribute Mapping (if needed)

Clerk should automatically map standard OIDC claims. If you encounter issues with user data not populating correctly, you may need to configure attribute mapping in Clerk's dashboard.

MyMLH provides these claims:
- `id` - Unique MLH user ID
- `first_name`, `last_name` - User's name
- `email` - Email address
- `phone_number` - Phone number
- `profile` - Contains country, gender, age, race/ethnicity
- `address` - Shipping address object
- `education` - Array of educational institutions
- `professional_experience` - Array of employers

## Step 5: Test the Integration

1. Visit your HackKit sign-up page
2. You should see MyMLH as a login option
3. Click it and authorize with a test MLH account
4. Verify the user data is populated correctly in Clerk

## Troubleshooting

### "Invalid redirect URI" error
Ensure the Clerk callback URL is added exactly as shown in your MyMLH application settings.

### User data not syncing
Check that you've enabled the appropriate scopes for the data you need. Scope changes may require users to re-authorize.

### Token refresh issues
Ensure `offline_access` scope is enabled if you need to keep user data updated after initial authorization.

## Resources

- [MyMLH Developer Documentation](https://my.mlh.io/developers/docs)
- [Clerk Custom OAuth Provider Guide](https://clerk.com/docs/authentication/social-connections/custom-provider)
- [MyMLH OIDC Discovery](https://my.mlh.io/.well-known/openid-configuration)
