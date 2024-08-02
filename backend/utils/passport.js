import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userAPI from '../services/user.service.js';
import { isValidPassword, encryptPassword } from './bcrypt.js';
import FileController from '../controllers/fileController.js';

passport.use('sign-in', new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        userAPI.getByEmail(email)
            .then(user => {
                if (!user) {
                    console.log(`User with ${email} not found.`);
                    return done(null, false);
                }
                if (!isValidPassword(password, user.password)) {
                    console.log('Invalid Password');
                    return done(null, false);
                }
                done(null, user);
            })
            .catch(error => {
                console.log('Error in login\n', error.message);
                done(error);
            })
    }))

passport.use('sign-up', new LocalStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        userAPI.getByEmail(email)
            .then(async (user) => {
                if (user) {
                    console.log(`User ${email} already exists.`);
                    return done(null, false);
                }
                if (!(req.body.name && req.body.email && req.body.password)) {
                    console.log(`Incomplete data. Name, email and password is required.`);
                    return done(null, false);
                }

                let avatar;
                // Save user avatar in public/image/avatar or set default avatar in case there isn't any
                (req.files !== null) && (avatar = await FileController.uploadFile(req.files.avatar, `${email}`));

                const newUser = {
                    ...req.body,
                    avatar,
                    password: encryptPassword(password)
                }
                const response = await userAPI.create(newUser);
                console.log(`User ${response.email} registration successful.`);
                done(null, response);
            })
            .catch(error => {
                console.log('Error in register', error.message);
                return done(error);
            })
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userAPI.getById(id)
        .then(user => done(null, user))
        .catch(done)
});

export default passport;