# Hyperbolic Timer

Mobile-first interval/workout timer. React + Vite front end, Supabase backend.

## Layout
- `front-end/` React app (`npm run dev`, `npm run lint`, `npm run build` from here). `.env` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key only, gitignored; restart `npm run dev` after editing).
- `supabase/` `schema.sql` (applied), `schema.planned.sql` (proposed), `erd.png`.
- `.claude/` skills and agents: `front-end-agent` (UI), `supabase-agent` (schema, RLS, data layer).
- `.mcp.json` Supabase MCP server for this project.
- `Hyperbolic Timer Wireframes/` design reference.

## Rules
- Never commit `.env` or the service role key; the client uses only the publishable key.
- Destructive database changes need user approval first.
