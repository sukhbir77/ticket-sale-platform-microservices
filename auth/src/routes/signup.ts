import express from "express";

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
        res.status(400).send("Provide valid Email.");
    }
});

export { router as signupRouter };