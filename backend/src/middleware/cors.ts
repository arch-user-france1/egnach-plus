import corsLib from 'cors';

const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const cors = corsLib({ origin, credentials: true });
