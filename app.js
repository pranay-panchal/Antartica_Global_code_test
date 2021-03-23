const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(express.text());

app.use('/', (req, res, error) => {
    if (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running successfully on ${PORT}`);
    } else {
        console.log(`Oops something went wrong, please try again. \nHere is the error message: ${error}`);
    }
});