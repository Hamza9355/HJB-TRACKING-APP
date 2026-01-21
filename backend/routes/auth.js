const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const twilio = require('twilio');

// Initialiser Twilio (optionnel - WhatsApp/SMS)
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Initialiser Nodemailer (optionnel)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Générer JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key_hjb', {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
};

// Envoyer email de vérification
const sendVerificationEmail = async (email, code) => {
  if (!transporter) {
    console.log(`📧 Email de vérification (MODE DEV): Code ${code} pour ${email}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Vérifiez votre email - HJB Tracking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a237e;">Vérification de votre email</h2>
          <p>Bienvenue sur HJB Tracking System!</p>
          <p>Voici votre code de vérification:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code expire dans 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">Ne partagez ce code avec personne.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    console.log(`📧 Mode fallback: Code ${code}`);
  }
};

// Envoyer WhatsApp/SMS de vérification
const sendVerificationSMS = async (phone, code) => {
  if (!client) {
    console.log(`📱 SMS de vérification (MODE DEV): Code ${code} pour ${phone}`);
    return;
  }

  try {
    await client.messages.create({
      body: `Votre code de vérification HJB Tracking: ${code}. Valide 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
    console.log(`📱 Mode fallback: Code ${code}`);
  }
};

// INSCRIPTION
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Log les données reçues
    console.log('📝 Données d\'inscription reçues:', { firstName, lastName, email, phone, passwordLength: password?.length });

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      console.log('❌ Validation échouée: champs manquants');
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (password !== confirmPassword) {
      console.log('❌ Les mots de passe ne correspondent pas');
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 6) {
      console.log('❌ Mot de passe trop court');
      return res.status(400).json({ error: 'Le mot de passe doit avoir au moins 6 caractères' });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ Email déjà utilisé:', email);
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      password,
      emailVerificationCode: emailCode,
      phoneVerificationCode: phoneCode,
    });

    console.log('💾 Tentative de sauvegarde du nouvel utilisateur...');
    await user.save();
    console.log('✅ Utilisateur créé avec succès:', user._id);

    // Envoyer codes de vérification
    await Promise.all([
      sendVerificationEmail(email, emailCode),
      sendVerificationSMS(phone, phoneCode),
    ]);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Vérifiez votre email et WhatsApp.',
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error('❌ Erreur inscription:', error.message);
    console.error('Détails complets:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de l\'inscription' });
  }
});

// VÉRIFICATION EMAIL
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ error: 'Code incorrect' });
    }

    user.emailVerified = true;
    user.emailVerificationCode = null;
    await user.save();

    res.json({ 
      success: true,
      message: 'Email vérifié avec succès' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// VÉRIFICATION WHATSAPP/SMS
router.post('/verify-phone', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.phoneVerificationCode !== code) {
      return res.status(400).json({ error: 'Code incorrect' });
    }

    user.phoneVerified = true;
    user.phoneVerificationCode = null;
    await user.save();

    res.json({ 
      success: true,
      message: 'Téléphone vérifié avec succès' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// CONNEXION
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// GET PROFILE
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// UPDATE PROFILE
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, lastName, company, jobTitle, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { firstName, lastName, company, jobTitle, preferences },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
