require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require("./models/note");
const app = express();

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


// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map((note) => note.id))
//         : 0
//     return maxId + 1;
// }

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

// GET all notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then((result) => {
        res.send(result);
    })
});

//  GET a single note
app.get('/api/notes/:id', (req, res) => {

    Note.findById(req.params.id).then(note => {
        res.json(note);
    })
        .catch((err) => {
            console.log('Error', err);
        })

});

//  POSTING a note
app.post('/api/notes', (req, res) => {
    const body = req.body;

    if (body.content === undefined || body.content === '') {
        return res.status(400).json({
            error: 'Content missing',
        });
    }

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote);
    });

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

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})