export const DEFAULT_DEMO_USER_ID = '67c100000000000000000001';

export const authMiddleware = (req, res, next) => {
  try {
    const userIdHeader = req.headers['x-user-id'];
    const authHeader = req.headers['authorization'];

    let userId = null;

    if (userIdHeader) {
      userId = userIdHeader;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      userId = authHeader.split(' ')[1];
    }

    req.userId = userId || DEFAULT_DEMO_USER_ID;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.userId = DEFAULT_DEMO_USER_ID;
    next();
  }
};
