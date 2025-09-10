import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.post('/', (req, res) => {
  res.send('¡Hola desde Express + TypeScript!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
