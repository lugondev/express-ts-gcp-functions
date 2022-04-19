import * as express from "express";
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseClient from '@firebase/app';
import * as authClient from '@firebase/auth';
import authenticate from './authenticate';
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";

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


router.post('/register', async (req, res) => {
    const {email, password} = req.body

    authClient.createUserWithEmailAndPassword(auth, email, password).then(async createdUser => {
        authClient.sendEmailVerification(createdUser.user).then(r => console.log(r))
        await firebaseAdmin.auth().setCustomUserClaims(createdUser.user.uid, {}).then(r => console.log(r))
        res.status(200)
        res.send({
            message: `User registered: ${createdUser.user.email}`,
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

router.get('/user', authenticate, async (req, res) => {
    res.send(JSON.stringify(req['user']))
})

router.post('/resend-verify', authenticate, async (req, res) => {
    const userLogged: DecodedIdToken = req['user']
    if (userLogged.email_verified) {
        res.send({
            status: false,
            message: "Email is verified"
        })
        return
    }

    await authClient.sendEmailVerification(auth.currentUser)
    res.send({
        status: true,
        message: "Email is sent"
    })
})
