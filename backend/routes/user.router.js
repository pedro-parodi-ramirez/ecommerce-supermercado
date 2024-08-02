import { Router } from 'express';
import {
    createUser,
    getAll,
    searchUser,
    verifyAuth,
    authMe,
    signIn,
    signUp,
    signOut
} from '../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

/******************************************** POST ********************************************/

// Add user
router.post('/', createUser);

// Sign in
router.post('/sign-in', passport.authenticate('sign-in'), signIn);

// Sign up
router.post('/sign-up', passport.authenticate('sign-up'), signUp);

// Sign out
router.post('/sign-out', verifyAuth, signOut);

/******************************************** GET ********************************************/

// Get all users
router.get('/', verifyAuth, getAll);

// Search by ID
router.get('/:id', searchUser);

// Auth me
router.get('/auth/me', verifyAuth, authMe);

export default router;