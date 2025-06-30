import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, AlertCircle } from 'lucide-react';

const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phoneNumbers: [],
    availableHours: {
      weekdays: { from: '09:00', to: '17:00' },
      weekends: { from: '', to: '' }
    }
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contact info
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch contact info
        const contactResponse = await fetch('http://localhost:8090/api/v1/companyInfo/contactus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!contactResponse.ok) {
          throw new Error(`Contact info fetch failed! status: ${contactResponse.status}`);
        }
        
        const contactResult = await contactResponse.json();
        
        if (contactResult.success) {
          setContactInfo(prev => ({
            ...prev,
            email: contactResult.data.email || '',
            phoneNumbers: contactResult.data.phoneNumbers || [],
            availableHours: contactResult.data.availableHours || {
              weekdays: { from: '09:00', to: '17:00' },
              weekends: { from: '', to: '' }
            }
          }));
        } else {
          throw new Error(contactResult.message || 'Failed to fetch contact info');
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setError('Failed to load contact information. Please try again later.');
        // Set default values if API fails
        setContactInfo({
          email: '',
          phoneNumbers: [],
          availableHours: {
            weekdays: { from: '09:00', to: '17:00' },
            weekends: { from: '', to: '' }
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    // Check if we have a contact email
    if (!contactInfo.email) {
      setSubmitStatus('error');
      return;
    }

    try {
      // Create mailto URL with pre-filled information
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\n` +
        `This message was sent from the contact form.`
      );
      
      const mailtoUrl = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoUrl;
      
      // Clear form and show success message
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      console.error('Error opening email client:', error);
      setSubmitStatus('error');
    }
  };

  const formatHours = (hours) => {
    if (!hours || !hours.from || !hours.to) return 'Closed';
    return `${hours.from} - ${hours.to}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBFFF1' }}>
      {/* Header Section */}
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <nav className="text-sm mb-6">
            <span className="text-stone-400">Home</span>
            <span className="text-stone-400 mx-2">/</span>
            <span className="text-amber-400">Contact</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold">CONTACT</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Contact Us Header */}
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold mb-2 tracking-wide">CONTACT US</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">
            Feel Free To Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Contact Cards */}
            {!isLoading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Phone */}
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-stone-200">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-stone-900" />
                    </div>
                    <h3 className="font-semibold text-stone-900 mb-2">Phone</h3>
                    <div className="text-stone-600 text-sm space-y-1">
                      {contactInfo.phoneNumbers && contactInfo.phoneNumbers.length > 0 ? (
                        contactInfo.phoneNumbers.map((phone, index) => (
                          <p key={index}>{phone}</p>
                        ))
                      ) : (
                        <p className="text-stone-400">No phone numbers available</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-stone-200">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-stone-900" />
                    </div>
                    <h3 className="font-semibold text-stone-900 mb-2">Email</h3>
                    <p className="text-stone-600 text-sm">
                      {contactInfo.email || 'No email available'}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-amber-500 mr-3" />
                    <h3 className="font-semibold text-stone-900">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Weekdays:</span>
                      <span className="text-stone-900 font-medium">
                        {formatHours(contactInfo.availableHours?.weekdays)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Weekends:</span>
                      <span className="text-stone-900 font-medium">
                        {formatHours(contactInfo.availableHours?.weekends)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  Email client opened successfully! Please send the message from your email application.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {!contactInfo.email 
                    ? 'Contact email not available. Please try again later.' 
                    : 'Please fill in all required fields.'
                  }
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!contactInfo.email || !formData.name || !formData.email || !formData.subject || !formData.message}
                className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  {!contactInfo.email ? 'Loading...' : 'Send via Email'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;