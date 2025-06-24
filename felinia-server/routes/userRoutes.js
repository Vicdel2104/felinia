import express from 'express';
const router = express.Router();

// Rotta di registrazione base (mock)
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email e password richiesti" });
  }
  // 👇 Per ora mock (senza DB)
  return res.status(200).json({ token: "fake-token", email });
});

export default router;
