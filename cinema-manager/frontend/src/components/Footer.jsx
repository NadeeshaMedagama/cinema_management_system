import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [expandedPrivacy, setExpandedPrivacy] = useState(null);
  const [showCancellation, setShowCancellation] = useState(false);
  const [expandedCancellation, setExpandedCancellation] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleTerm = (index) => {
    setExpandedTerm(expandedTerm === index ? null : index);
  };

  const togglePrivacy = (index) => {
    setExpandedPrivacy(expandedPrivacy === index ? null : index);
  };

  const toggleCancellation = (index) => {
    setExpandedCancellation(expandedCancellation === index ? null : index);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);

    try {
      const response = await fetch('http://localhost:8081/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        setContactSubmitted(true);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        alert('Thank you! Your message has been submitted successfully.');
        setTimeout(() => {
          setContactSubmitted(false);
          setShowContact(false);
        }, 3000);
      } else {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        alert('Failed to submit. Server error: ' + response.status);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form. Please make sure the backend server is running on port 8081.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const faqs = [
    {
      category: "Booking & Tickets",
      questions: [
        {
          question: "How do I book tickets online?",
          answer: "To book tickets, simply browse our movie listings, select your preferred showtime, choose your seats, and proceed to payment. You'll receive a confirmation email with your e-ticket immediately after successful payment."
        },
        {
          question: "Can I cancel or modify my booking?",
          answer: "Yes, you can cancel your booking up to 2 hours before the showtime. Go to 'My Bookings' in your profile, select the booking you want to cancel, and click 'Cancel Booking'. Refunds will be processed within 5-7 business days."
        },
        {
          question: "Do I need to print my ticket?",
          answer: "No, you don't need to print your ticket. Simply show your e-ticket (via email or in the app) at the theater entrance. You can also use the booking ID for entry."
        },
        {
          question: "Can I book tickets for multiple movies at once?",
          answer: "Yes, you can book tickets for multiple movies in separate transactions. Each booking will have its own confirmation and e-ticket."
        }
      ]
    },
    {
      category: "Payments & Refunds",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards (Visa, Mastercard, American Express), digital wallets (PayPal, Apple Pay, Google Pay), and net banking from all major banks."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely! We use industry-standard SSL encryption and PCI-DSS compliant payment gateways to ensure your payment information is completely secure."
        },
        {
          question: "How long does it take to get a refund?",
          answer: "Refunds are processed within 5-7 business days from the cancellation date. The amount will be credited back to your original payment method."
        },
        {
          question: "Can I get a refund if I miss the movie?",
          answer: "Unfortunately, we cannot provide refunds for missed shows. Please ensure you arrive on time. We recommend arriving at least 15 minutes before the showtime."
        }
      ]
    },
    {
      category: "Theater Experience",
      questions: [
        {
          question: "What are your theater timings?",
          answer: "Our theaters are open from 9:00 AM to 11:30 PM daily. Show timings vary based on the movie schedule. Check our website for specific showtimes."
        },
        {
          question: "Do you have parking facilities?",
          answer: "Yes, we have ample parking space available at all our locations. Parking is complimentary for the first 4 hours with a valid ticket."
        },
        {
          question: "Are outside food and beverages allowed?",
          answer: "Outside food and beverages are not permitted inside the theater. However, we have a wide range of snacks, meals, and beverages available at our concession stands."
        },
        {
          question: "Do you offer special seating for people with disabilities?",
          answer: "Yes, we have wheelchair-accessible seating and facilities at all our locations. Please inform us at the time of booking for special arrangements."
        }
      ]
    },
    {
      category: "Loyalty & Offers",
      questions: [
        {
          question: "What is the loyalty points program?",
          answer: "Our loyalty program rewards you with points for every booking. Earn 10 points per dollar spent. Accumulated points can be redeemed for discounts, free tickets, and exclusive perks."
        },
        {
          question: "How do I check my loyalty points balance?",
          answer: "You can view your loyalty points balance in your profile section under 'My Account'. Points are updated immediately after each transaction."
        },
        {
          question: "Do loyalty points expire?",
          answer: "Loyalty points are valid for 12 months from the date of earning. Points nearing expiration will be highlighted in your account."
        },
        {
          question: "Are there any special offers for students or seniors?",
          answer: "Yes! We offer special discounts for students (with valid ID) and senior citizens (60+). Check our 'Offers' section for current promotions."
        }
      ]
    },
    {
      category: "Account & Profile",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' at the top of the page, enter your details (name, email, phone, password), and verify your email. You can then start booking tickets immediately."
        },
        {
          question: "I forgot my password. What should I do?",
          answer: "Click on 'Forgot Password' on the login page, enter your registered email, and you'll receive a password reset link. Follow the instructions to create a new password."
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, go to your profile page and click on 'Edit Profile'. You can update your name, phone number, and other details. Email changes require verification."
        },
        {
          question: "How do I delete my account?",
          answer: "To delete your account, please contact our customer support at support@cinematic.com. Note that this action is irreversible and you'll lose all loyalty points."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The website is not working properly. What should I do?",
          answer: "Try clearing your browser cache and cookies, or use a different browser. If the issue persists, contact our support team at support@cinematic.com with details about the problem."
        },
        {
          question: "I didn't receive my confirmation email. What should I do?",
          answer: "Check your spam/junk folder. If you still can't find it, log into your account and go to 'My Bookings' to view your ticket. You can also contact support with your booking ID."
        },
        {
          question: "Can I access my bookings without an account?",
          answer: "No, you need to create an account to view and manage your bookings. However, you can retrieve booking details using your booking ID and registered email by contacting support."
        }
      ]
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 4V20M17 4V20M3 8H7M17 8H21M3 12H7M17 12H21M3 16H7M17 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="footer-logo-text">
                <span className="footer-brand-name">CINEMATIC</span>
                <span className="footer-brand-tagline">Premium Cinema Experience</span>
              </div>
            </div>
            <p className="footer-description">
              Experience the magic of movies like never before. State-of-the-art theaters, 
              premium comfort, and unforgettable entertainment await you.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/movies">Now Showing</Link></li>
              <li><Link to="/movies">Coming Soon</Link></li>
              <li><Link to="/profile">My Bookings</Link></li>
              <li><Link to="/profile">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); setShowFAQ(true); }}>FAQs</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setShowContact(true); }}>Contact Us</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms of Service</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a></li>
              <li><a href="#cancellation" onClick={(e) => { e.preventDefault(); setShowCancellation(true); }}>Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section footer-newsletter">
            <h3 className="footer-title">Stay Updated</h3>
            <p className="newsletter-description">
              Subscribe to get exclusive offers and latest movie updates!
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {subscribed && (
                <span className="subscribe-success">
                  ✓ Successfully subscribed!
                </span>
              )}
            </form>
            <div className="contact-info">
              <div className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>support@cinematic.com</span>
              </div>
              <div className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>+1 (800) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Cinematic. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#accessibility">Accessibility</a>
              <a href="#sitemap">Sitemap</a>
              <a href="#careers">Careers</a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="faq-modal-overlay" onClick={() => setShowFAQ(false)}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="faq-modal-header">
              <div className="faq-header-content">
                <div className="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2>Frequently Asked Questions</h2>
                  <p>Find answers to common questions about booking, payments, and more</p>
                </div>
              </div>
              <button className="faq-close-btn" onClick={() => setShowFAQ(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="faq-modal-body">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="faq-category">
                  <h3 className="faq-category-title">
                    <span className="category-icon">
                      {categoryIndex === 0 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                        </svg>
                      )}
                      {categoryIndex === 1 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"/>
                          <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                        </svg>
                      )}
                      {categoryIndex === 2 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
                          <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2"/>
                        </svg>
                      )}
                      {categoryIndex === 3 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2"/>
                        </svg>
                      )}
                      {categoryIndex === 4 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                        </svg>
                      )}
                      {categoryIndex === 5 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
                        </svg>
                      )}
                    </span>
                    {category.category}
                  </h3>
                  <div className="faq-questions">
                    {category.questions.map((faq, index) => {
                      const faqIndex = `${categoryIndex}-${index}`;
                      return (
                        <div key={index} className="faq-item">
                          <button
                            className={`faq-question ${expandedFAQ === faqIndex ? 'active' : ''}`}
                            onClick={() => toggleFAQ(faqIndex)}
                          >
                            <span className="faq-q-icon">Q</span>
                            <span className="faq-q-text">{faq.question}</span>
                            <svg
                              className={`faq-toggle-icon ${expandedFAQ === faqIndex ? 'rotated' : ''}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <div className={`faq-answer ${expandedFAQ === faqIndex ? 'expanded' : ''}`}>
                            <div className="faq-answer-content">
                              <span className="faq-a-icon">A</span>
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="terms-modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <div className="terms-header-content">
                <div className="terms-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
                    <polyline points="14 2 14 8 20 8" strokeWidth="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/>
                    <polyline points="10 9 9 9 8 9" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h2>Terms of Service</h2>
                  <p>Last Updated: December 14, 2025</p>
                </div>
              </div>
              <button className="terms-close-btn" onClick={() => setShowTerms(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="terms-modal-body">
              {/* Introduction */}
              <div className="terms-section">
                <div className="terms-intro">
                  <p>
                    Welcome to <strong>Cinematic</strong>. These Terms of Service ("Terms") govern your access to and use of our website, 
                    mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be 
                    bound by these Terms. Please read them carefully.
                  </p>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 0 ? 'active' : ''}`}
                  onClick={() => toggleTerm(0)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">1</span>
                    <h3>Acceptance of Terms</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 0 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 0 ? 'expanded' : ''}`}>
                  <p>By creating an account, making a booking, or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must not use our Services.</p>
                  <p>We reserve the right to modify these Terms at any time. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.</p>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 1 ? 'active' : ''}`}
                  onClick={() => toggleTerm(1)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">2</span>
                    <h3>User Accounts and Registration</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 1 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 1 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Account Creation:</strong> To book tickets, you must create an account by providing accurate and complete information including your name, email address, phone number, and password.</li>
                    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                    <li><strong>Age Requirement:</strong> You must be at least 13 years old to create an account. Users under 18 must have parental consent.</li>
                    <li><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activities.</li>
                    <li><strong>One Account Per User:</strong> Each user is permitted only one account. Creating multiple accounts may result in suspension.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 2 ? 'active' : ''}`}
                  onClick={() => toggleTerm(2)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">3</span>
                    <h3>Ticket Booking and Purchases</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 2 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 2 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Booking Process:</strong> All bookings must be completed through our website or mobile app. Ticket prices are clearly displayed before purchase confirmation.</li>
                    <li><strong>Payment:</strong> We accept various payment methods including credit/debit cards and digital wallets. All transactions are processed securely through certified payment gateways.</li>
                    <li><strong>Confirmation:</strong> Upon successful payment, you will receive a confirmation email with your e-ticket. This serves as proof of purchase.</li>
                    <li><strong>Ticket Validity:</strong> Tickets are valid only for the specified date, time, and showtime. They cannot be exchanged for different shows.</li>
                    <li><strong>Seat Selection:</strong> Seat availability is shown in real-time. Once selected and paid for, seats are reserved exclusively for you.</li>
                    <li><strong>Pricing:</strong> All prices are in USD and include applicable taxes. Service fees and convenience charges are clearly displayed during checkout.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 3 ? 'active' : ''}`}
                  onClick={() => toggleTerm(3)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">4</span>
                    <h3>Cancellation and Refund Policy</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 3 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 3 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Cancellation Window:</strong> Tickets can be cancelled up to 2 hours before the scheduled showtime through your account dashboard.</li>
                    <li><strong>Refund Processing:</strong> Approved refunds are processed within 5-7 business days to the original payment method.</li>
                    <li><strong>Cancellation Fees:</strong> A cancellation fee of 10% of the ticket price applies to all cancellations.</li>
                    <li><strong>No Show Policy:</strong> No refunds will be issued for missed shows or late arrivals.</li>
                    <li><strong>Technical Issues:</strong> If a show is cancelled due to technical problems, full refunds will be provided automatically.</li>
                    <li><strong>Force Majeure:</strong> In case of unforeseen circumstances (natural disasters, pandemics), we will provide refunds or credits at our discretion.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 4 ? 'active' : ''}`}
                  onClick={() => toggleTerm(4)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">5</span>
                    <h3>Theater Rules and Conduct</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 4 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 4 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Entry Requirements:</strong> Valid e-ticket or booking confirmation must be presented at theater entrance. Photo ID may be required for age-restricted films.</li>
                    <li><strong>Punctuality:</strong> Please arrive 15 minutes before showtime. Late entry may be denied to avoid disturbing other patrons.</li>
                    <li><strong>Prohibited Items:</strong> Outside food, beverages, weapons, recording devices, and hazardous materials are strictly prohibited.</li>
                    <li><strong>Recording Ban:</strong> Recording, photographing, or live-streaming any portion of the movie is illegal and will result in immediate expulsion and legal action.</li>
                    <li><strong>Behavior Standards:</strong> Disruptive behavior including loud talking, phone use, or harassment will not be tolerated. Staff may remove violators without refund.</li>
                    <li><strong>Age Restrictions:</strong> Age-restricted content ratings (PG-13, R) will be strictly enforced. Appropriate ID is required.</li>
                    <li><strong>Accessibility:</strong> We provide wheelchair-accessible seating and assistive listening devices upon request.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 5 ? 'active' : ''}`}
                  onClick={() => toggleTerm(5)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">6</span>
                    <h3>Loyalty Program</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 5 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 5 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Earning Points:</strong> Members earn 10 points per dollar spent on tickets, food, and merchandise.</li>
                    <li><strong>Redemption:</strong> Points can be redeemed for discounts, free tickets, and exclusive perks as specified in the rewards catalog.</li>
                    <li><strong>Point Validity:</strong> Points expire 12 months from the date of earning unless otherwise stated.</li>
                    <li><strong>Non-Transferable:</strong> Loyalty points are non-transferable and cannot be converted to cash.</li>
                    <li><strong>Program Changes:</strong> We reserve the right to modify or discontinue the loyalty program with 30 days notice.</li>
                    <li><strong>Fraud Prevention:</strong> Accounts found manipulating the system will have points forfeited and may be permanently banned.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 6 ? 'active' : ''}`}
                  onClick={() => toggleTerm(6)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">7</span>
                    <h3>Intellectual Property Rights</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 6 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 6 ? 'expanded' : ''}`}>
                  <p>All content on our website and app, including text, graphics, logos, images, video clips, and software, is the property of Cinematic or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                  <ul className="terms-list">
                    <li><strong>License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes.</li>
                    <li><strong>Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of our Services without explicit written permission.</li>
                    <li><strong>Trademarks:</strong> Cinematic name, logo, and related marks are our trademarks and may not be used without permission.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 7 ? 'active' : ''}`}
                  onClick={() => toggleTerm(7)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">8</span>
                    <h3>Privacy and Data Protection</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 7 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 7 ? 'expanded' : ''}`}>
                  <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as described in our Privacy Policy.</p>
                  <ul className="terms-list">
                    <li><strong>Data Collection:</strong> We collect personal information necessary for account management, bookings, and service improvement.</li>
                    <li><strong>Data Security:</strong> We implement industry-standard security measures to protect your information from unauthorized access.</li>
                    <li><strong>Third-Party Services:</strong> Payment processing and analytics services may have access to your data as required for their functionality.</li>
                    <li><strong>Marketing:</strong> You may opt out of marketing communications at any time through your account settings.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 8 ? 'active' : ''}`}
                  onClick={() => toggleTerm(8)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">9</span>
                    <h3>Limitation of Liability</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 8 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 8 ? 'expanded' : ''}`}>
                  <p>To the fullest extent permitted by law, Cinematic shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our Services, including but not limited to:</p>
                  <ul className="terms-list">
                    <li>Loss of profits, data, or business opportunities</li>
                    <li>Service interruptions or errors</li>
                    <li>Unauthorized access to your account</li>
                    <li>Personal injury or property damage at our theaters (covered by separate liability insurance)</li>
                  </ul>
                  <p>Our total liability for any claims arising from these Terms or your use of Services shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 9 ? 'active' : ''}`}
                  onClick={() => toggleTerm(9)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">10</span>
                    <h3>Dispute Resolution and Governing Law</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 9 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 9 ? 'expanded' : ''}`}>
                  <ul className="terms-list">
                    <li><strong>Governing Law:</strong> These Terms are governed by the laws of the United States, without regard to conflict of law provisions.</li>
                    <li><strong>Informal Resolution:</strong> Before pursuing formal legal action, you agree to contact us to attempt to resolve the dispute informally.</li>
                    <li><strong>Arbitration:</strong> Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</li>
                    <li><strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive the right to participate in class actions.</li>
                    <li><strong>Venue:</strong> Any legal proceedings must be brought in courts located in our jurisdiction.</li>
                  </ul>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 10 ? 'active' : ''}`}
                  onClick={() => toggleTerm(10)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">11</span>
                    <h3>Changes to Terms and Services</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 10 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 10 ? 'expanded' : ''}`}>
                  <p>We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time. We will notify users of material changes to these Terms via email or through prominent notices on our platform.</p>
                  <p>Continued use of our Services after such modifications constitutes acceptance of the updated Terms. If you do not agree with the changes, you must discontinue using our Services.</p>
                </div>
              </div>

              <div className="terms-section">
                <button
                  className={`terms-section-header ${expandedTerm === 11 ? 'active' : ''}`}
                  onClick={() => toggleTerm(11)}
                >
                  <div className="terms-section-title">
                    <span className="terms-number">12</span>
                    <h3>Contact Information</h3>
                  </div>
                  <svg className={`terms-toggle-icon ${expandedTerm === 11 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`terms-section-content ${expandedTerm === 11 ? 'expanded' : ''}`}>
                  <p>If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:</p>
                  <div className="terms-contact-info">
                    <p><strong>Email:</strong> legal@cinematic.com</p>
                    <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                    <p><strong>Mailing Address:</strong> Cinematic Legal Department, 123 Cinema Boulevard, Los Angeles, CA 90028, USA</p>
                    <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="terms-acknowledgment">
                <div className="acknowledgment-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                  </svg>
                  <div>
                    <h4>Acknowledgment</h4>
                    <p>By using Cinematic's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="privacy-modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="privacy-modal-header">
              <div className="privacy-header-content">
                <div className="privacy-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2>Privacy Policy</h2>
                  <p>Last Updated: December 14, 2025</p>
                </div>
              </div>
              <button className="privacy-close-btn" onClick={() => setShowPrivacy(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="privacy-modal-body">
              {/* Introduction */}
              <div className="privacy-section">
                <div className="privacy-intro">
                  <p>
                    At <strong>Cinematic</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our website, mobile application, 
                    and services. By using our Services, you consent to the data practices described in this policy.
                  </p>
                </div>
              </div>

              {/* Privacy Sections */}
              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 0 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(0)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">1</span>
                    <h3>Information We Collect</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 0 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 0 ? 'expanded' : ''}`}>
                  <h4 className="privacy-subsection">Personal Information You Provide</h4>
                  <ul className="privacy-list">
                    <li><strong>Account Information:</strong> Name, email address, phone number, password, date of birth</li>
                    <li><strong>Payment Information:</strong> Credit/debit card details, billing address (processed securely through third-party payment processors)</li>
                    <li><strong>Profile Information:</strong> Profile picture, preferences, movie ratings and reviews</li>
                    <li><strong>Communication Data:</strong> Customer support inquiries, feedback, and correspondence with us</li>
                  </ul>
                  <h4 className="privacy-subsection">Information Collected Automatically</h4>
                  <ul className="privacy-list">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on pages, booking history</li>
                    <li><strong>Location Data:</strong> Geographic location based on IP address or device settings (with permission)</li>
                    <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
                  </ul>
                  <h4 className="privacy-subsection">Information from Third Parties</h4>
                  <ul className="privacy-list">
                    <li><strong>Social Media:</strong> Information from social login providers (Facebook, Google, Apple)</li>
                    <li><strong>Payment Processors:</strong> Transaction confirmation and payment status</li>
                    <li><strong>Marketing Partners:</strong> Aggregated demographic and interest data</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 1 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(1)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">2</span>
                    <h3>How We Use Your Information</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 1 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 1 ? 'expanded' : ''}`}>
                  <p>We use your personal information for the following purposes:</p>
                  <ul className="privacy-list">
                    <li><strong>Service Delivery:</strong> Process bookings, manage your account, send e-tickets and confirmations</li>
                    <li><strong>Payment Processing:</strong> Complete transactions, issue refunds, prevent fraud</li>
                    <li><strong>Communication:</strong> Send booking confirmations, updates, customer support responses, and service notifications</li>
                    <li><strong>Personalization:</strong> Recommend movies, customize content, remember preferences</li>
                    <li><strong>Marketing:</strong> Send promotional offers, newsletters, special events (with your consent)</li>
                    <li><strong>Analytics:</strong> Analyze usage patterns, improve services, conduct research</li>
                    <li><strong>Security:</strong> Detect and prevent fraud, protect against security threats</li>
                    <li><strong>Legal Compliance:</strong> Comply with legal obligations, resolve disputes, enforce agreements</li>
                    <li><strong>Loyalty Program:</strong> Track and manage loyalty points, rewards, and benefits</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 2 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(2)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">3</span>
                    <h3>How We Share Your Information</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 2 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 2 ? 'expanded' : ''}`}>
                  <p>We may share your information with the following parties:</p>
                  <ul className="privacy-list">
                    <li><strong>Service Providers:</strong> Payment processors, email service providers, cloud hosting, analytics platforms</li>
                    <li><strong>Business Partners:</strong> Movie distributors, concession suppliers, promotional partners</li>
                    <li><strong>Legal Requirements:</strong> Law enforcement, government agencies, courts when legally required</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> Other parties when you explicitly authorize sharing</li>
                  </ul>
                  <p className="privacy-note"><strong>Note:</strong> We never sell your personal information to third parties for their marketing purposes.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 3 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(3)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">4</span>
                    <h3>Cookies and Tracking Technologies</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 3 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 3 ? 'expanded' : ''}`}>
                  <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                  <ul className="privacy-list">
                    <li><strong>Essential Cookies:</strong> Required for basic site functionality, authentication, and security</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings, language, and customization choices</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics, etc.)</li>
                    <li><strong>Marketing Cookies:</strong> Track effectiveness of advertisements and deliver personalized ads</li>
                    <li><strong>Social Media Cookies:</strong> Enable sharing on social platforms and track social engagement</li>
                  </ul>
                  <p>You can control cookies through your browser settings. However, disabling certain cookies may limit functionality.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 4 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(4)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">5</span>
                    <h3>Data Security</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 4 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 4 ? 'expanded' : ''}`}>
                  <p>We implement comprehensive security measures to protect your personal information:</p>
                  <ul className="privacy-list">
                    <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission, encrypted storage for sensitive data</li>
                    <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication for staff</li>
                    <li><strong>Payment Security:</strong> PCI-DSS compliant payment processing, no storage of full card details</li>
                    <li><strong>Regular Audits:</strong> Security assessments, vulnerability testing, penetration testing</li>
                    <li><strong>Employee Training:</strong> Staff trained on data protection and privacy best practices</li>
                    <li><strong>Incident Response:</strong> Protocols for detecting and responding to security breaches</li>
                  </ul>
                  <p className="privacy-warning">While we implement strong security measures, no system is 100% secure. Please protect your account credentials and notify us immediately of any unauthorized access.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 5 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(5)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">6</span>
                    <h3>Your Privacy Rights</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 5 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 5 ? 'expanded' : ''}`}>
                  <p>Depending on your location, you may have the following rights:</p>
                  <ul className="privacy-list">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                    <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Restriction:</strong> Limit how we process your data in certain circumstances</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent was required</li>
                  </ul>
                  <p>To exercise these rights, contact us at <strong>privacy@cinematic.com</strong> or through your account settings.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 6 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(6)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">7</span>
                    <h3>Data Retention</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 6 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 6 ? 'expanded' : ''}`}>
                  <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:</p>
                  <ul className="privacy-list">
                    <li><strong>Account Data:</strong> Retained while your account is active, plus 3 years after closure</li>
                    <li><strong>Transaction Records:</strong> Retained for 7 years for accounting and tax purposes</li>
                    <li><strong>Marketing Data:</strong> Retained until you opt-out or unsubscribe</li>
                    <li><strong>Legal Holds:</strong> Data related to legal disputes retained until resolution</li>
                    <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely</li>
                  </ul>
                  <p>After the retention period, we securely delete or anonymize your data.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 7 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(7)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">8</span>
                    <h3>Children's Privacy</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 7 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 7 ? 'expanded' : ''}`}>
                  <p>Our Services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
                  <ul className="privacy-list">
                    <li><strong>Age Verification:</strong> Users must be at least 13 to create an account</li>
                    <li><strong>Parental Consent:</strong> Users under 18 should have parental consent</li>
                    <li><strong>Discovery:</strong> If we learn we have collected data from a child under 13, we will delete it immediately</li>
                    <li><strong>Parent Rights:</strong> Parents can request deletion of their child's information by contacting us</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 8 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(8)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">9</span>
                    <h3>International Data Transfers</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 8 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 8 ? 'expanded' : ''}`}>
                  <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards:</p>
                  <ul className="privacy-list">
                    <li><strong>Data Transfer Agreements:</strong> Standard contractual clauses approved by regulatory authorities</li>
                    <li><strong>Privacy Shield:</strong> Compliance with applicable data transfer frameworks</li>
                    <li><strong>Adequate Protection:</strong> Transfers only to countries with adequate data protection laws</li>
                    <li><strong>Your Consent:</strong> We obtain consent where required for international transfers</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 9 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(9)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">10</span>
                    <h3>Third-Party Links and Services</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 9 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 9 ? 'expanded' : ''}`}>
                  <p>Our Services may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices of these third parties.</p>
                  <ul className="privacy-list">
                    <li><strong>External Links:</strong> Third-party sites have their own privacy policies</li>
                    <li><strong>Social Media:</strong> Social platforms have separate data collection practices</li>
                    <li><strong>Payment Processors:</strong> Follow the privacy policies of payment providers</li>
                    <li><strong>Recommendations:</strong> Review privacy policies before sharing information with third parties</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 10 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(10)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">11</span>
                    <h3>California Privacy Rights (CCPA)</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 10 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 10 ? 'expanded' : ''}`}>
                  <p>California residents have additional rights under the California Consumer Privacy Act (CCPA):</p>
                  <ul className="privacy-list">
                    <li><strong>Right to Know:</strong> Information about personal data collected, used, and shared</li>
                    <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
                    <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we don't sell data)</li>
                    <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                    <li><strong>Authorized Agent:</strong> Designate an agent to make requests on your behalf</li>
                  </ul>
                  <p>To exercise CCPA rights, email <strong>privacy@cinematic.com</strong> with "California Privacy Rights" in the subject line.</p>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 11 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(11)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">12</span>
                    <h3>Changes to Privacy Policy</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 11 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 11 ? 'expanded' : ''}`}>
                  <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.</p>
                  <ul className="privacy-list">
                    <li><strong>Notification:</strong> We will notify you of material changes via email or prominent notice on our platform</li>
                    <li><strong>Review Date:</strong> The "Last Updated" date at the top indicates when changes were last made</li>
                    <li><strong>Continued Use:</strong> Using our Services after changes constitutes acceptance of the updated policy</li>
                    <li><strong>Archive:</strong> Previous versions available upon request</li>
                  </ul>
                </div>
              </div>

              <div className="privacy-section">
                <button
                  className={`privacy-section-header ${expandedPrivacy === 12 ? 'active' : ''}`}
                  onClick={() => togglePrivacy(12)}
                >
                  <div className="privacy-section-title">
                    <span className="privacy-number">13</span>
                    <h3>Contact Us About Privacy</h3>
                  </div>
                  <svg className={`privacy-toggle-icon ${expandedPrivacy === 12 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`privacy-section-content ${expandedPrivacy === 12 ? 'expanded' : ''}`}>
                  <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:</p>
                  <div className="privacy-contact-info">
                    <p><strong>Privacy Team Email:</strong> privacy@cinematic.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@cinematic.com</p>
                    <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                    <p><strong>Mailing Address:</strong> Cinematic Privacy Department, 123 Cinema Boulevard, Los Angeles, CA 90028, USA</p>
                    <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
                  </div>
                </div>
              </div>

              {/* Consent Statement */}
              <div className="privacy-consent">
                <div className="consent-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <h4>Your Consent</h4>
                    <p>By using Cinematic's services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal information as described herein.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancellation && (
        <div className="cancellation-modal-overlay" onClick={() => setShowCancellation(false)}>
          <div className="cancellation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cancellation-modal-header">
              <div className="cancellation-header-content">
                <div className="cancellation-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h2>Cancellation & Refund Policy</h2>
                  <p>Last Updated: December 14, 2025</p>
                </div>
              </div>
              <button className="cancellation-close-btn" onClick={() => setShowCancellation(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="cancellation-modal-body">
              {/* Introduction */}
              <div className="cancellation-section">
                <div className="cancellation-intro">
                  <p>
                    At <strong>Cinematic</strong>, we understand that plans can change. This Cancellation and Refund Policy outlines 
                    the terms and conditions under which you can cancel your booking and request a refund. Please read this policy 
                    carefully before making a purchase, as all bookings are subject to these terms.
                  </p>
                </div>
              </div>

              {/* Cancellation Sections */}
              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 0 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(0)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">1</span>
                    <h3>Ticket Cancellation Policy</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 0 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 0 ? 'expanded' : ''}`}>
                  <h4 className="cancellation-subsection">Standard Tickets</h4>
                  <ul className="cancellation-list">
                    <li><strong>More than 4 hours before showtime:</strong> Full refund (100% of ticket price minus processing fee)</li>
                    <li><strong>2-4 hours before showtime:</strong> 75% refund of ticket price</li>
                    <li><strong>1-2 hours before showtime:</strong> 50% refund of ticket price</li>
                    <li><strong>Less than 1 hour before showtime:</strong> No refund available</li>
                    <li><strong>After showtime has started:</strong> No refund available under any circumstances</li>
                  </ul>
                  <h4 className="cancellation-subsection">Premium & Special Screenings</h4>
                  <ul className="cancellation-list">
                    <li><strong>IMAX, 3D, 4DX screenings:</strong> Cancellation allowed up to 6 hours before showtime (80% refund)</li>
                    <li><strong>Special events & premieres:</strong> Cancellation allowed up to 24 hours before showtime (75% refund)</li>
                    <li><strong>Private screenings:</strong> Cancellation allowed up to 48 hours before showtime (70% refund)</li>
                    <li><strong>Film festivals & marathons:</strong> Non-refundable once purchased</li>
                  </ul>
                  <h4 className="cancellation-subsection">Processing Fees</h4>
                  <p>A processing fee of $1.50 per ticket applies to all cancellations, deducted from the refund amount. This fee covers administrative and payment processing costs.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 1 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(1)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">2</span>
                    <h3>How to Cancel Your Booking</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 1 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 1 ? 'expanded' : ''}`}>
                  <h4 className="cancellation-subsection">Online Cancellation (Recommended)</h4>
                  <ul className="cancellation-list">
                    <li><strong>Step 1:</strong> Log in to your Cinematic account</li>
                    <li><strong>Step 2:</strong> Navigate to "My Bookings" section in your profile</li>
                    <li><strong>Step 3:</strong> Select the booking you wish to cancel</li>
                    <li><strong>Step 4:</strong> Click "Cancel Booking" button</li>
                    <li><strong>Step 5:</strong> Confirm cancellation and select refund method</li>
                    <li><strong>Step 6:</strong> Receive instant confirmation via email</li>
                  </ul>
                  <h4 className="cancellation-subsection">Mobile App Cancellation</h4>
                  <ul className="cancellation-list">
                    <li>Open the Cinematic mobile app</li>
                    <li>Go to "My Tickets" tab</li>
                    <li>Tap on the booking to cancel</li>
                    <li>Select "Cancel Booking" and confirm</li>
                    <li>Refund will be processed automatically</li>
                  </ul>
                  <h4 className="cancellation-subsection">Customer Support Cancellation</h4>
                  <ul className="cancellation-list">
                    <li><strong>Phone:</strong> Call +1 (800) 123-4567 with your booking ID</li>
                    <li><strong>Email:</strong> Send cancellation request to bookings@cinematic.com</li>
                    <li><strong>Live Chat:</strong> Use our 24/7 live chat feature on the website</li>
                    <li><strong>Response Time:</strong> Support cancellations processed within 15 minutes during business hours</li>
                  </ul>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 2 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(2)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">3</span>
                    <h3>Refund Processing</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 2 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 2 ? 'expanded' : ''}`}>
                  <h4 className="cancellation-subsection">Refund Timeline</h4>
                  <ul className="cancellation-list">
                    <li><strong>Credit/Debit Card:</strong> 5-7 business days from cancellation date</li>
                    <li><strong>Digital Wallets (PayPal, Apple Pay, Google Pay):</strong> 2-3 business days</li>
                    <li><strong>Net Banking:</strong> 3-5 business days</li>
                    <li><strong>Cinematic Wallet:</strong> Instant credit to your wallet balance</li>
                    <li><strong>Gift Cards:</strong> Refunded as Cinematic credit (non-transferable)</li>
                  </ul>
                  <h4 className="cancellation-subsection">Refund Methods</h4>
                  <ul className="cancellation-list">
                    <li><strong>Original Payment Method:</strong> Default refund option, credited to the same card/account used for booking</li>
                    <li><strong>Cinematic Wallet:</strong> Instant credit that can be used for future bookings (includes 5% bonus)</li>
                    <li><strong>Bank Transfer:</strong> Available for refunds over $50 (requires bank details verification)</li>
                  </ul>
                  <p className="cancellation-note"><strong>Note:</strong> Refund processing times may vary during peak seasons and holidays. You'll receive email notifications at each stage of the refund process.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 3 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(3)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">4</span>
                    <h3>Food & Beverage Cancellations</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 3 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 3 ? 'expanded' : ''}`}>
                  <p>Food and beverage orders placed along with ticket bookings follow specific cancellation rules:</p>
                  <ul className="cancellation-list">
                    <li><strong>More than 2 hours before showtime:</strong> Full refund of food order (100%)</li>
                    <li><strong>1-2 hours before showtime:</strong> 75% refund of food order</li>
                    <li><strong>Less than 1 hour before showtime:</strong> No refund on food orders</li>
                    <li><strong>Combo deals:</strong> Refunded proportionally based on ticket cancellation eligibility</li>
                    <li><strong>Pre-prepared items:</strong> Non-refundable within 30 minutes of showtime</li>
                    <li><strong>Partially consumed orders:</strong> Not eligible for refund</li>
                  </ul>
                  <p className="cancellation-note"><strong>Important:</strong> Food orders are automatically cancelled when you cancel your ticket booking. You cannot cancel food orders independently without cancelling tickets.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 4 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(4)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">5</span>
                    <h3>Show Cancellation by Cinema</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 4 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 4 ? 'expanded' : ''}`}>
                  <p>If we cancel a show due to technical issues, emergencies, or other unforeseen circumstances:</p>
                  <ul className="cancellation-list">
                    <li><strong>Full Refund:</strong> 100% refund including all booking and processing fees</li>
                    <li><strong>Compensation:</strong> Additional $5 Cinematic credit per ticket as a goodwill gesture</li>
                    <li><strong>Alternative Screening:</strong> Priority booking for the next available showtime of the same movie</li>
                    <li><strong>Free Upgrade:</strong> Option to upgrade to premium seating for rescheduled show (subject to availability)</li>
                    <li><strong>Notification:</strong> Instant SMS and email alerts with refund instructions</li>
                    <li><strong>Processing Time:</strong> Automatic refund initiated within 24 hours</li>
                  </ul>
                  <p className="cancellation-warning"><strong>Weather-Related Closures:</strong> In case of extreme weather conditions or natural disasters, full refunds are processed automatically. No action required from customers.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 5 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(5)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">6</span>
                    <h3>Partial Cancellations</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 5 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 5 ? 'expanded' : ''}`}>
                  <p>For group bookings, you can cancel individual tickets while keeping others active:</p>
                  <ul className="cancellation-list">
                    <li><strong>Minimum Tickets:</strong> At least one ticket must remain active in the booking</li>
                    <li><strong>Same Time Limits:</strong> Partial cancellations follow the same time-based refund rules</li>
                    <li><strong>Seat Selection:</strong> Remaining seats will be preserved; canceled seats become available for rebooking</li>
                    <li><strong>Group Discounts:</strong> If cancellation drops below group size threshold, pricing may be adjusted</li>
                    <li><strong>Processing Fee:</strong> Applied per ticket cancelled, not per transaction</li>
                    <li><strong>Food Orders:</strong> Proportionally reduced based on cancelled tickets</li>
                  </ul>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 6 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(6)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">7</span>
                    <h3>Loyalty Program & Cancellations</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 6 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 6 ? 'expanded' : ''}`}>
                  <h4 className="cancellation-subsection">Points & Rewards</h4>
                  <ul className="cancellation-list">
                    <li><strong>Points Earned:</strong> Loyalty points earned from cancelled bookings are automatically deducted</li>
                    <li><strong>Points Redeemed:</strong> Points used for booking are credited back to your account upon cancellation</li>
                    <li><strong>Tier Status:</strong> Cancelled bookings don't count toward tier progression</li>
                    <li><strong>Free Tickets:</strong> Complimentary tickets from rewards can be cancelled but points are not refunded</li>
                    <li><strong>Bonus Points:</strong> Promotional bonus points from cancelled bookings may be reversed</li>
                  </ul>
                  <h4 className="cancellation-subsection">Membership Benefits</h4>
                  <ul className="cancellation-list">
                    <li><strong>Gold/Platinum Members:</strong> Reduced processing fee ($1.00 instead of $1.50)</li>
                    <li><strong>Premium Members:</strong> Extended cancellation window (additional 1 hour grace period)</li>
                    <li><strong>No-Show Protection:</strong> Elite members get one free no-show per year without penalty</li>
                  </ul>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 7 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(7)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">8</span>
                    <h3>Non-Refundable Situations</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 7 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 7 ? 'expanded' : ''}`}>
                  <p>The following situations are not eligible for refunds under any circumstances:</p>
                  <ul className="cancellation-list">
                    <li><strong>Late Arrival:</strong> Missing the showtime due to late arrival</li>
                    <li><strong>Wrong Show:</strong> Attending the wrong show or screen by mistake</li>
                    <li><strong>Personal Reasons:</strong> Dissatisfaction with movie content, quality, or experience</li>
                    <li><strong>Technical Issues on Customer's End:</strong> Problems with customer's devices, internet, or app</li>
                    <li><strong>Third-Party Bookings:</strong> Tickets purchased through unauthorized resellers</li>
                    <li><strong>Expired Tickets:</strong> Attempting to use tickets after showtime has passed</li>
                    <li><strong>Fraudulent Bookings:</strong> Transactions flagged for suspicious activity</li>
                    <li><strong>Post-Movie Cancellation:</strong> Cancellation requests after the movie has ended</li>
                  </ul>
                  <p className="cancellation-warning"><strong>Important:</strong> Refund policies cannot be overridden by customer service representatives. All cancellations are subject to the terms outlined in this policy.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 8 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(8)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">9</span>
                    <h3>Modified Bookings</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 8 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 8 ? 'expanded' : ''}`}>
                  <p>Instead of cancelling, consider modifying your booking to a different showtime or date:</p>
                  <ul className="cancellation-list">
                    <li><strong>Free Modifications:</strong> Change showtime once for free up to 3 hours before the original show</li>
                    <li><strong>Same Movie Only:</strong> Modifications must be for the same movie title</li>
                    <li><strong>Price Difference:</strong> Pay or receive refund for any ticket price difference</li>
                    <li><strong>Seat Selection:</strong> Choose from available seats in the new showtime</li>
                    <li><strong>Modification Fee:</strong> $2.00 per ticket for second and subsequent modifications</li>
                    <li><strong>Time Limit:</strong> Modifications allowed up to 7 days from original showtime</li>
                  </ul>
                  <p>To modify your booking, go to "My Bookings" and select "Change Showtime" option.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 9 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(9)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">10</span>
                    <h3>Dispute Resolution</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 9 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 9 ? 'expanded' : ''}`}>
                  <p>If you disagree with a cancellation or refund decision:</p>
                  <ul className="cancellation-list">
                    <li><strong>Step 1:</strong> Contact Customer Support at support@cinematic.com with your booking ID and reason for dispute</li>
                    <li><strong>Step 2:</strong> Provide supporting documentation (screenshots, emails, etc.)</li>
                    <li><strong>Step 3:</strong> Wait for review by our specialized team (48-72 hours)</li>
                    <li><strong>Step 4:</strong> Receive decision via email with detailed explanation</li>
                    <li><strong>Step 5:</strong> If unresolved, escalate to Senior Management (escalations@cinematic.com)</li>
                    <li><strong>Final Appeal:</strong> Submit formal complaint through our online dispute portal</li>
                  </ul>
                  <p className="cancellation-note"><strong>Resolution Time:</strong> Most disputes are resolved within 5-7 business days. Complex cases may take up to 14 business days.</p>
                </div>
              </div>

              <div className="cancellation-section">
                <button
                  className={`cancellation-section-header ${expandedCancellation === 10 ? 'active' : ''}`}
                  onClick={() => toggleCancellation(10)}
                >
                  <div className="cancellation-section-title">
                    <span className="cancellation-number">11</span>
                    <h3>Contact Cancellation Support</h3>
                  </div>
                  <svg className={`cancellation-toggle-icon ${expandedCancellation === 10 ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`cancellation-section-content ${expandedCancellation === 10 ? 'expanded' : ''}`}>
                  <p>Need help with cancellations or refunds? Reach out to our dedicated support team:</p>
                  <div className="cancellation-contact-info">
                    <p><strong>24/7 Support Hotline:</strong> +1 (800) 123-4567</p>
                    <p><strong>Email Support:</strong> bookings@cinematic.com</p>
                    <p><strong>Live Chat:</strong> Available on website and mobile app</p>
                    <p><strong>WhatsApp:</strong> +1 (800) 123-4568</p>
                    <p><strong>Support Hours:</strong> 24/7 for urgent cancellations, 9 AM - 9 PM for general inquiries</p>
                    <p><strong>Average Response Time:</strong> Phone (immediate), Email (2-4 hours), Chat (5-10 minutes)</p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="cancellation-notice">
                <div className="notice-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
                  </svg>
                  <div>
                    <h4>Important Reminders</h4>
                    <ul>
                      <li>Always check cancellation deadlines before making bookings</li>
                      <li>Save your booking confirmation and cancellation receipts</li>
                      <li>Refunds are subject to payment method availability and bank processing times</li>
                      <li>This policy is subject to change; check for updates before each booking</li>
                      <li>Special promotions may have different cancellation terms</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContact && (
        <div className="contact-modal-overlay" onClick={() => setShowContact(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <div className="contact-header-content">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2>Contact Us</h2>
                  <p>We'd love to hear from you</p>
                </div>
              </div>
              <button className="contact-close-btn" onClick={() => setShowContact(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="contact-modal-body">
              {contactSubmitted ? (
                <div className="contact-success">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="contact-intro">
                    <p>Have a question, suggestion, or need support? Fill out the form below and our team will respond as soon as possible.</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                        </svg>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
                          <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
                        </svg>
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Booking Support">Booking Support</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Refund Request">Refund Request</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="Tell us more about your inquiry..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <div className="contact-info-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p>We typically respond within <strong>24-48 hours</strong>. For urgent matters, please call us at <strong>+1 (800) 123-4567</strong>.</p>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={contactSubmitting}>
                    {contactSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
