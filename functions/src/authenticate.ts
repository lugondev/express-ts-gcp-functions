import * as firebaseAdmin from "firebase-admin";

export default async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            res.status(401)
            res.send('Unauthorized');
            return
        }

        const idToken = req.headers.authorization.split('Bearer ')[1];
        req.user = await firebaseAdmin.auth().verifyIdToken(idToken);
        next();
    } catch (e) {
        res.status(401)
        res.send('Unauthorized');
    }
}
