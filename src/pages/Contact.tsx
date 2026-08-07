import { Mail, MessageSquare, MapPin, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Contact Us — GoshBuzz Pakistan</title>
        <meta name="description" content="Get in touch with GoshBuzz Pakistan via WhatsApp for any queries." />
        <meta property="og:title" content="Contact Us — GoshBuzz Pakistan" />
        <meta property="og:description" content="Get in touch with GoshBuzz Pakistan via WhatsApp for any queries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/contact" />
        <link rel="canonical" href="https://goshbuzz.com/contact" />
      </Helmet>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Have questions? We're here to help you get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-gray-50 dark:bg-gray-800 px-4 py-2" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-gray-50 dark:bg-gray-800 px-4 py-2" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-gray-50 dark:bg-gray-800 px-4 py-2" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">goshbuzzllc@gmail.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We usually respond within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Phone / WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">+923126999078</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available for quick queries and support.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Location</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Operating digitally, based in Pakistan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
