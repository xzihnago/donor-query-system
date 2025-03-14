pnpm i -P && pnpm run -r prisma:generate
cd backend && pm2 start ecosystem.config.cjs && pm2 save
