import * as express from "express";
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseClient from '@firebase/app';
import * as authClient from '@firebase/auth';

export const router = express()

firebaseAdmin.initializeApp()
// const db = firebaseAdmin.firestore()


const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    // messagingSenderId: "",
    // appId: "",
    // measurementId: ""
};

firebaseClient.initializeApp(firebaseConfig)


const auth = authClient.getAuth(firebaseClient.getApp());

if (process.env.LOCAL === 'true') {
    console.log("Local env")
    authClient.connectAuthEmulator(auth, "http://localhost:9099");
}


router.post('/register', (req, res) => {
    const {email, password} = req.body

    authClient.createUserWithEmailAndPassword(auth, email, password).then(createdUser => {

        authClient.sendEmailVerification(createdUser.user).then(r => console.log(r))
        firebaseAdmin.auth().setCustomUserClaims(createdUser.user.uid, {
            admin: true
        }).then(r => console.log(r))
        res.status(200)
        res.send({
            message: `User registered: ${createdUser.user.uid}`,
        })
    }).catch(exception => {
        res.status(400)
        res.send(exception)
    })
})

router.post('/login', (req, res) => {
    const {email, password} = req.body

    authClient.signInWithEmailAndPassword(auth, email, password)
        .then(authenticatedUser => {
            return authenticatedUser.user.getIdToken()
        }).then(idToken => {
        res.status(200)
        res.send({
            token: idToken,
        })
    }).catch(exception => {
        res.status(422)
        res.send({
            data: exception
        })
    })
})

router.get('/logout', (async (req, res) => {
    try {
        await auth.signOut()
        res.status(200)
        res.send({
            message: 'You are logged out'
        })
    } catch (e) {
        res.send(e)
    }
}))
