# PTGRcars – Developer Information

## Project Overview
- **Name**: PTGRcars (formerly Realtor) – a premium automotive marketplace for buying, selling, and renting vehicles.
- **Primary Stack**:
  - Frontend: Next.js 14 (App Router) + TypeScript + TailwindCSS + Lucide icons.
  - Backend: Node.js (Express) + Sequelize ORM + PostgreSQL/MySQL (based on .env DB config).
  - Mobile: React Native (project includes a `mobile‑app` folder – not covered here).
- **Key Features**: Vehicle search, interactive maps (Leaflet), AI chat widget, auto‑loan calculator, dealer dashboard, multi‑role authentication (buyer/agent/admin).

## Development Environment
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API (default `http://localhost:5000/api`). |
| `NEXTAUTH_URL` | URL where NextAuth runs (default `http://localhost:3000`). |
| `NEXTAUTH_SECRET` | Secret used by NextAuth for signing tokens. |
| `DB_HOST` | Database host (e.g., `dir-express.com`). |
| `DB_PORT` | Database port (`3306`). |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Credentials for the relational database (named `realtor`). |
| `JWT_SECRET` & `JWT_EXPIRES_IN` | JWT signing secret and expiry for API authentication. |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | PayPal sandbox credentials used for payment processing. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials for social login. |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_BUCKET_NAME` | AWS S3 bucket configuration for image uploads (used by the listing form). |
| `FRONTEND_URL` / `ADMIN_FRONTEND_URL` | URLs for the public and admin front‑ends (currently hosted on Vercel). |
| `GEMINI_API_KEY` | API key for Gemini integration (if used for AI‑powered components). |

These variables are stored in the root `.env` file. **Never commit the real values** to version control – they should remain secret.

## Repository & Version Control
- The project uses **Git** (`.git` folder present).  No explicit remote URL is stored in the visible files, but you can retrieve the remote with `git remote -v` from the repository root.
- **Contributors**: Not listed in `package.json`; you may add an `"author"` or `"contributors"` field for future reference.

## Building & Running
```bash
# Install dependencies (frontend and backend)
cd PTGRcars/frontend && npm install
cd ../backend && npm install

# Set up the .env file (copy .env.example if provided) and fill in the values above.

# Run the backend (Node/Express)
npm run dev   # or nodemon, depending on scripts

# Run the Next.js frontend
npm run dev   # typically starts on http://localhost:3000
```

## Contact / Ownership
- **Primary Owner**: PTGR Cars (the branding entity).  The original repository was forked from a real‑estate marketplace project, rebranded for automotive use.
- **Developer Team**: The environment variables suggest a team managing PayPal, Google OAuth, and AWS resources.  For any issues, reach out to the repository maintainer (often the same email used for the PayPal or Google OAuth client, which is not publicly exposed).

---
*This file is intended for developers onboarding the PTGRcars codebase.  Keep the secrets in `.env` secure and update this document as the project evolves.*
