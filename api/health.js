export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  return res.json({ 
    ok: true,
    timestamp: new Date().toISOString(),
    node: process.version,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    },
    platform: 'vercel',
  });
}

