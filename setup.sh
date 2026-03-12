pnpm i -P
cd backend/database && pnpm run db:generate && pnpm run db:deploy
cd ../adapter-node && pm2 start ecosystem.config.cjs && pm2 save
