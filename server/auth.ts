import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "raise-ds-session-secret-2025",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if this is an email login
        const isEmail = username.includes('@');
        console.log(`Login attempt - ${isEmail ? 'Email' : 'Username'}: ${username}`);
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user) {
          console.log('User not found');
          return done(null, false);
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          console.log('Password mismatch');
          return done(null, false);
        }
        
        console.log('Login successful');
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, institution } = req.body;
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user with hashed password
      const user = await storage.createUser({
        username,
        email,
        firstName,
        lastName,
        institution,
        password: await hashPassword(password),
      });
      
      // Create empty profile for the user
      await storage.createProfile({
        userId: user.id,
        bio: "",
        isPresenter: false,
        isCommitteeMember: false,
        socialLinks: {}
      });
      
      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        const safeUser = { ...user };
        delete safeUser.password;
        res.status(201).json(safeUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        const safeUser = { ...user };
        delete safeUser.password;
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const safeUser = { ...req.user };
    delete safeUser.password;
    res.json(safeUser);
  });
}
