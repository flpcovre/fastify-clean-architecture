import { createFastifyApp } from './adapters/http/server';
import './infra/events/events.bootstrap';

createFastifyApp().then((app) => {
  app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('Server is running on http://localhost:3333');
  });
});