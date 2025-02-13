pnpm i -P && pnpm run prisma:generate
pm2 start ecosystem.config.cjs && pm2 save
