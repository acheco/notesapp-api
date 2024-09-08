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

app.use(express.json());
app.use(express.static('dist'));
app.use(requestLogger);
app.use(cors());

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
app.get('/api/notes/:id', (req, res, next) => {

    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.send(note);
            } else {
                res.status(404).send({error: 'Not Found'});
            }
        })
        .catch(err => next(err))
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
app.delete('/api/notes/:id', (req, res, next) => {

    Note.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => next(err))

});

app.put('/api/notes/:id', (req, res, next) => {

    const body = req.body;

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(req.params.id, note, {new: true})
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(err => next(err))
})

// middleware para manejo de solicitudes con endpoint desconocidos
const unknownEndpoint = (req, res, next) => {
    res.status(404).send({error: 'unknown endpoint '});
    next();
}

app.use(unknownEndpoint);

// El middleware de manejo de errores debe ser el último en cargarse, de lo contrario,
// tendremos problemas al momento de utilizarlo

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({error: 'Invalid ID format'});
    }

    next(err);
}

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})