const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://fayvaz52:csmPGR3gHR5zzMXs@cluster0.xrs1hsp.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});