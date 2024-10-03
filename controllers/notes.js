const notesRouter = require("express").Router();
const Note = require("../models/note");

// Get all notes
notesRouter.get('/', (req, res, next) => {
    Note.find({})
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
})

//  GET a single note
notesRouter.get('/:id', (req, res, next) => {

    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).send({error: 'Not Found'});
            }
        })
        .catch(err => next(err))
});

//  POSTING a note
notesRouter.post('/', (req, res, next) => {
    const body = req.body;

    if (body.content === undefined) {
        return res.status(400).json({
            error: 'Content missing',
        });
    }

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    note.save()
        .then(savedNote => {
            res.json(savedNote);
        })
        .catch(err => next(err))
})

//  DELETE a note
notesRouter.delete('/:id', (req, res, next) => {

    Note.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => next(err))

});

// Updating a note
notesRouter.put('/:id', (req, res, next) => {

    const {content, important} = req.body;

    Note.findByIdAndUpdate(
        req.params.id,
        {content, important},
        {new: true, runValidators: true, context: 'query'}
    )
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(err => next(err))
})

module.exports = notesRouter;