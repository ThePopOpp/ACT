import { useState } from 'react';
import { Phone, Mail, Clock, Facebook, Calendar } from 'lucide-react';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiry: string;
  consent: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  schedulingUrl: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Scott Spaulding',
    role: 'Donor Support',
    email: 'scott@arizonachristiantuition.com',
    phone: '(602) 421-8301',
    schedulingUrl: 'https://arizonachristiantuition.com/scott-spaulding/',
  },
  {
    name: 'Chris Leavitt',
    role: 'Family Support',
    email: 'chris@arizonachristiantuition.com',
    phone: '(602) 421-8301',
    schedulingUrl: 'https://arizonachristiantuition.com/chris-leavitt/',
  },
  {
    name: 'Jeremy Waters',
    role: 'General Support',
    email: 'hello@arizonachristiantuition.com',
    phone: '(602) 421-8301',
    schedulingUrl: 'https://arizonachristiantuition.com/jeremy-waters/',
  },
];

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiry: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rawApiBase = import.meta.env.VITE_CONTACT_API_BASE;
    const contactApiBase = rawApiBase
      ? rawApiBase.startsWith('/')
        ? `http://localhost:54321/functions/v1${rawApiBase}`
        : rawApiBase
      : 'http://localhost:54321/functions/v1/make-server-8482237f';

    try {
      const response = await fetch(`${contactApiBase}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          inquiry: formData.inquiry,
        }),
      });

      const rawBody = await response.text();
      let data: any = {};
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = { error: rawBody };
        }
      }

      if (!response.ok) {
        console.error('Contact API returned error', data || rawBody);
        throw new Error(data?.error || `Failed to send message (${response.status})`);
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiry: '',
        consent: false,
      });

      alert('Thank you for your message! We\'ll get back to you soon.');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      const msg = error instanceof Error ? error.message : 'Unable to send message';
      alert(`There was an error sending your message: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#e8eef5] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl font-bold text-[#1a2d5a] mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Contact Us
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600 mb-6">
            <Clock size={20} />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>
              Monday - Friday 9:00 am to 5:00 pm
            </span>
          </div>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Contact us to schedule a consultation – either in-person or over the phone.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2
                className="text-2xl font-bold text-[#1a2d5a] mb-6"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Quick Contact Form
              </h2>
              <p
                className="text-gray-600 mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Send us a message and we'll get your questions answered as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8202d] focus:border-transparent"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8202d] focus:border-transparent"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8202d] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8202d] focus:border-transparent"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Your Inquiry *
                  </label>
                  <textarea
                    id="inquiry"
                    name="inquiry"
                    required
                    rows={4}
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8202d] focus:border-transparent resize-vertical"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Please describe your question or how we can help..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-[#c8202d] focus:ring-[#c8202d] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    I consent to Arizona Christian Tuition storing my submitted information so they can respond to my inquiry *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c8202d] hover:bg-[#a01825] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* General Inquiries */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3
                className="text-xl font-bold text-[#1a2d5a] mb-4"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                General Inquiries
              </h3>
              <p
                className="text-gray-600 mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Reach us at hello@arizonachristiantuition.com and we will get back to you as soon as possible.
              </p>
              <a
                href="mailto:hello@arizonachristiantuition.com"
                className="inline-flex items-center gap-2 text-[#c8202d] hover:text-[#a01825] font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Mail size={18} />
                hello@arizonachristiantuition.com
              </a>
            </div>

            {/* Support Contacts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3
                className="text-xl font-bold text-[#1a2d5a] mb-6"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Support Contacts
              </h3>

              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className="text-lg font-semibold text-[#1a2d5a] mb-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {member.name}
                        </h4>
                        <p
                          className="text-sm text-gray-600 mb-3"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {member.role}
                        </p>
                        <div className="space-y-2">
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-[#c8202d] hover:text-[#a01825] text-sm"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <Mail size={16} />
                            {member.email}
                          </a>
                          <a
                            href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                            className="flex items-center gap-2 text-[#c8202d] hover:text-[#a01825] text-sm"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <Phone size={16} />
                            {member.phone}
                          </a>
                        </div>
                      </div>
                      <a
                        href={member.schedulingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#1a2d5a] hover:bg-[#0f1e3d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <Calendar size={16} />
                        Schedule
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3
                className="text-xl font-bold text-[#1a2d5a] mb-4"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/arizonachristiantuition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#1877f2] hover:bg-[#166fe5] rounded-lg flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointments Section */}
        <div className="mt-16 bg-[#1a2d5a] rounded-lg p-8 text-center text-white">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Book Appointments Online
          </h2>
          <p
            className="text-lg mb-6 opacity-90 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Meet with a Certified Financial Planner or Wealth Advisor—schedule your appointment now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+16024218301"
              className="inline-flex items-center justify-center gap-2 bg-[#c8202d] hover:bg-[#a01825] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Phone size={18} />
              Call (602) 421-8301
            </a>
            <a
              href="mailto:info@actsto.org"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a2d5a] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Mail size={18} />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}