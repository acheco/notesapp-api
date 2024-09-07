const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.489ei.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
//     content: 'CSS is Hard',
//     important: true,
// });
//
// const note2 = new Note({
//     content: 'Mongoose makes things easy',
//     important: true,
// });

// note2.save().then(note => {
//     console.log('Note2 saved')
//     mongoose.connection.close();
// });
//
// note.save().then(() => {
//     console.log('Note saved!');
//     mongoose.connection.close();
// });

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close();
})