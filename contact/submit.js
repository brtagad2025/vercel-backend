import { body, validationResult } from 'express-validator';

// Since Vercel API routes don’t natively support express-validator,
// you can manually validate or use a helper library for validation.

// For simplicity, here's basic manual validation:

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, company = '', service = '', message } = req.body;

  // Basic validation
  if (!name || name.length < 2 || name.length > 100) {
    return res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters' });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }

  if (company.length > 100) {
    return res.status(400).json({ success: false, message: 'Company name cannot exceed 100 characters' });
  }

  const allowedServices = [
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
  ];

  if (service && !allowedServices.includes(service)) {
    return res.status(400).json({ success: false, message: 'Invalid service selection' });
  }

  if (!message || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ success: false, message: 'Message must be between 10 and 2000 characters' });
  }

  // Save contact data here
  // For example, you could connect to a database (MongoDB, etc.) here.
  // Or send an email notification, etc.

  // For demo, we just return success:

  return res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully! We will get back to you soon.',
    submissionId: 'demo12345'
  });
}
