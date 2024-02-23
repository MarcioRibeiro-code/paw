const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://PAW:PAW@paw.bjt35mm.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB connected successfully.');
})
.catch((err) => {
    console.log('Error connecting to MongoDB: ' + JSON.stringify(err, undefined, 2));
});
