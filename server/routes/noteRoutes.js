const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/notes', noteController.createNote);
router.get('/notes', noteController.getNotes);
router.get('/notes/stats', noteController.getStats);
router.patch('/notes/:id/like', noteController.likeNote);
router.patch('/notes/:id/unlike', noteController.unlikeNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const noteController = require('../controllers/noteController');

// router.post('/notes', noteController.createNote);
// router.get('/notes', noteController.getNotes);
// router.patch('/notes/:id/like', noteController.likeNote);
// router.patch('/notes/:id/unlike', noteController.unlikeNote);
// router.delete('/notes/:id', noteController.deleteNote);

// module.exports = router;
