import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

// ✅ Allow your Next.js dev server
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

const DEMO_EMAIL = "demo@demo.com";
const DEMO_PASSWORD = "demo123";

function makeToken(userId: string) {
  return `axiom_${userId}_${Date.now()}`; // placeholder token
}

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || typeof email !== "string") return res.status(400).json({ error: "Email required" });
  if (!password || typeof password !== "string")
    return res.status(400).json({ error: "Password required" });

  const e = email.trim().toLowerCase();

  if (e !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user: User = {
    id: "usr_demo",
    email: DEMO_EMAIL,
    name: "Demo User",
    avatarUrl: null,
  };

  return res.json({ user, token: makeToken(user.id) });
});

app.post("/auth/signup", (req, res) => {
  // Placeholder: in final version, create user in DB
  // For now we just reject and tell user to use demo login
  return res.status(501).json({
    error: "Signup is not enabled yet. Please use demo@demo.com / demo123",
  });
});

app.post("/auth/google", (_req, res) => {
  // Placeholder: later you’ll add Google OAuth
  return res.status(501).json({
    error: "Google sign-in is coming soon",
  });
});

app.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token.startsWith("axiom_usr_demo_") && !token.startsWith("axiom_usr_demo")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({
    user: { id: "usr_demo", email: DEMO_EMAIL, name: "Demo User", avatarUrl: null },
  });
});

// -----------------------------
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Axiom API running on http://localhost:${port}`));