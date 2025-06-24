import express from 'express';
import { body, validationResult } from 'express-validator';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client (use environment variables for security)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Submit contact form (public route)
router.post('/submit', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('whatsapp')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('WhatsApp number must be between 10 and 15 characters'),
  body('service')
    .optional()
    .isIn([
      'E-Commerce Development',
      'Mobile App Development', 
      'Business Websites',
      'Digital Marketing',
      'ERP Solutions',
      'Project Management Software',
      'Email Marketing',
      'Salesforce Integration',
      'Other',
      ''
    ])
    .withMessage('Invalid service selection'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { name, email, company, whatsapp, service, message } = req.body;

    // Get client IP and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket?.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Prepare contact data
    const contactData = {
      name,
      email,
      company: company || '',
      whatsapp,
      service: service || '',
      message,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit contact form. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Log the submission
    console.log(`📧 New contact submission from: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully! We will get back to you soon.',
      submissionId: data && data[0] ? data[0].id : null
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all contact submissions (no authentication for now)
router.get('/', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve contact submissions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.json({
      success: true,
      data: contacts
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve contact submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
