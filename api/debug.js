module.exports = async (req, res) => {
  try {
    // Test 1: Basic response
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      env: {
        hasDatabase: Boolean(process.env.DATABASE_URL),
        hasJWT: Boolean(process.env.JWT_SECRET),
        databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT_SET',
      },
      cwd: process.cwd(),
      __dirname: __dirname,
    };
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
};

