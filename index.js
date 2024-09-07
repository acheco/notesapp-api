const express = require('express');
const cors = require('cors');
const app = express();

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTML protocol",
        important: true
    }
];

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
}

const unknownEndpoint = (req, res, next) => {
    res.status(404).send({error: 'unknown endpoint '});
    next();
}

app.use(express.json());
app.use(express.static('dist'));
app.use(requestLogger);
app.use(cors());


const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map((note) => note.id))
        : 0
    return maxId + 1;
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

// GET all notes
app.get('/api/notes', (req, res) => {
    res.json(notes)
});

//  GET a single note
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);

    if (!note) {
        res.status(404).send(`A note with the id ${id} does not exist`);
    }
    res.json(note);
});

//  POSTING a note
app.post('/api/notes', (req, res) => {
    const body = req.body;

    if (!body.content) {
        return res.status(400).json({
            error: 'No content provided'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false,
    }

    notes = notes.concat(note);

    res.json(body);
})

//  DELETE a note
app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    if (!note) {
        res.status(404).send(`A note with the id ${id} dont exist or was already deleted`);
    }
    res.status(204).end();
});


app.use(unknownEndpoint);


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})