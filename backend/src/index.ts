import { createApp } from './app.js';

const port = parseInt(process.env.PORT || '4000', 10);
const app = createApp();

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
