import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/admin', (req, res) => {
    res.send('Welcome to the admin dashboard!');
});

app.get('/', (req, res) => {
    res.send('Hello friend!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
