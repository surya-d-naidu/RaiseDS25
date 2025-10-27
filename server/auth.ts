import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { generateOTP, sendOTPEmail, sendPasswordResetEmail } from "./email-utils";

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
  try {
    // Check if the stored password has the correct format
    if (!stored || !stored.includes('.')) {
      console.error('Invalid stored password format');
      return false;
    }
    
    const [hashed, salt] = stored.split(".");
    
    if (!hashed || !salt) {
      console.error('Invalid stored password components');
      return false;
    }
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Ensure both buffers have the same length before comparison
    if (hashedBuf.length !== suppliedBuf.length) {
      console.error(`Buffer length mismatch: stored=${hashedBuf.length}, supplied=${suppliedBuf.length}`);
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
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
          return done(null, false, { message: 'User not found' });
        }
        
        if (!user.password) {
          console.error('User has no password set');
          return done(new Error('User account is not properly configured'));
        }
        
        try {
          const passwordMatch = await comparePasswords(password, user.password);
          if (!passwordMatch) {
            console.log('Password mismatch');
            return done(null, false, { message: 'Incorrect password' });
          }
          
          console.log('Login successful');
          return done(null, user);
        } catch (passwordError) {
          console.error('Error during password comparison:', passwordError);
          return done(new Error('Error verifying credentials'));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    if (!user || !user.id) {
      console.warn('Cannot serialize undefined or invalid user');
      return done(null, false);
    }
    return done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    if (!id) {
      console.warn('No ID provided for deserialization');
      return done(null, false);
    }
    
    try {
      const user = await storage.getUser(id);
      
      if (!user) {
        console.warn(`User with ID ${id} not found during deserialization`);
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      // Don't throw an error here, just return false to avoid crashing
      return done(null, false);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, firstName, lastName, institution, invitationToken } = req.body;
      
      // If there's an invitation token, validate it first
      if (invitationToken) {
        const invitation = await storage.getInvitationByToken(invitationToken);
        
        if (!invitation) {
          return res.status(400).json({ message: "Invalid invitation token" });
        }
        
        // Check if invitation has expired
        if (invitation.expiresAt && new Date() > invitation.expiresAt) {
          return res.status(400).json({ message: "Invitation has expired" });
        }
        
        // Check if invitation is for account creation (not attendance)
        if (invitation.type !== "account") {
          return res.status(400).json({ message: "This invitation is not for account creation" });
        }
        
        // Ensure the email matches the invitation
        if (invitation.email !== email) {
          return res.status(400).json({ message: "Email must match the invitation email" });
        }
        
        // Check if invitation is still pending
        if (invitation.status !== "pending") {
          return res.status(400).json({ message: `This invitation has already been ${invitation.status}` });
        }
      }
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user with hashed password (email unverified)
      const user = await storage.createUser({
        username,
        email,
        firstName,
        lastName,
        institution,
        password: await hashPassword(password),
        emailVerified: false,
      });
      
      // Create empty profile for the user
      await storage.createProfile({
        userId: user.id,
        bio: "",
        isPresenter: false,
        isCommitteeMember: false,
        socialLinks: {}
      });
      
      // If there was an invitation token, mark it as accepted
      if (invitationToken) {
        await storage.updateInvitationStatus(invitationToken, "accepted");
      }
      
      // Generate and send OTP
      const otp = generateOTP();
      await storage.setEmailVerificationToken(user.id, otp);
      
      try {
        await sendOTPEmail(email, otp, firstName);
        console.log(`OTP sent to ${email}: ${otp}`); // For development
        
        res.status(201).json({
          message: invitationToken ? 
            "Registration successful via invitation. Please check your email for verification code." :
            "Registration successful. Please check your email for verification code.",
          requiresVerification: true,
          email: email,
          fromInvitation: !!invitationToken
        });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        // Still allow registration but inform user about email issue
        res.status(201).json({
          message: invitationToken ?
            "Registration successful via invitation but failed to send verification email. Please contact support." :
            "Registration successful but failed to send verification email. Please contact support.",
          requiresVerification: false,
          email: email,
          fromInvitation: !!invitationToken
        });
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: err.message || "Internal server error during authentication" });
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(403).json({ 
          message: "Please verify your email address before logging in.",
          requiresVerification: true,
          email: user.email
        });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Login session error:", loginErr);
          return res.status(500).json({ message: loginErr.message || "Error creating login session" });
        }
        
        const safeUser: any = { ...user };
        delete safeUser.password;
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });

  // Email verification endpoint
  app.post("/api/verify-email", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
      
      const user = await storage.verifyEmail(otp);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      
      // Auto-login the user after successful verification
      req.login(user, (err) => {
        if (err) {
          console.error("Auto-login error after verification:", err);
          return res.status(200).json({ 
            message: "Email verified successfully. Please log in.",
            verified: true 
          });
        }
        
        const safeUser: any = { ...user };
        delete safeUser.password;
        res.status(200).json({ 
          message: "Email verified successfully",
          verified: true,
          user: safeUser
        });
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Error verifying email" });
    }
  });

  // Resend OTP endpoint
  app.post("/api/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.resendVerificationToken(email);
      
      if (!user) {
        return res.status(400).json({ message: "User not found or already verified" });
      }
      
      // Generate and send new OTP
      const otp = generateOTP();
      await storage.setEmailVerificationToken(user.id, otp);
      
      try {
        await sendOTPEmail(email, otp, user.firstName);
        console.log(`New OTP sent to ${email}: ${otp}`); // For development
        
        res.status(200).json({ message: "New verification code sent to your email" });
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ message: "Error resending verification code" });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Forgot password endpoint
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      // Check if user exists and give clear feedback
      if (!user) {
        return res.status(404).json({ 
          message: "No account found with this email address. Please check your email or create a new account." 
        });
      }
      
      // Generate OTP for password reset
      const otp = generateOTP();
      await storage.setPasswordResetToken(email, otp);
      
      try {
        await sendPasswordResetEmail(email, otp, user.firstName);
        console.log(`Password reset OTP sent to ${email}: ${otp}`); // For development
        
        res.status(200).json({ 
          message: "Password reset code has been sent to your email.",
          email: email
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        res.status(500).json({ message: "Failed to send password reset email. Please try again." });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Error processing password reset request" });
    }
  });

  // Reset password endpoint
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      
      const user = await storage.verifyPasswordResetToken(otp);
      
      if (!user || user.email !== email) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the password and clear reset token
      await storage.updatePassword(user.id, hashedPassword);
      
      res.status(200).json({ 
        message: "Password reset successfully. You can now log in with your new password." 
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const safeUser: any = { ...req.user };
    delete safeUser.password;
    res.json(safeUser);
  });
}
