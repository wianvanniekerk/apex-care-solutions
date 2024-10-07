const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.render('index', { title: 'Home' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;