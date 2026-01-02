const express = require('express');
const router = express.Router();
//importation du controller
const { register, login, logout, currentUser } = require('../controllers/auth.controller');
const upload = require('../util/multer');
const { registerValidation,loginValidation } = require('../middlewares/validation/authVAlidation');
const { validate } = require('../middlewares/validation/validateur');
const isAuth = require('../middlewares/isAuth');
const hashRole = require('../middlewares/hashRole');


// router.get('/test', (req, res) => {
//     res.end('Auth route is working');
// });



router.post('/register', isAuth, hashRole('ADMIN'), upload.single('profilePic'),registerValidation,validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', isAuth, logout);
router.get('/current_user', isAuth, currentUser);







module.exports = router;