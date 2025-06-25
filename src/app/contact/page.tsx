/**
 * Contact page for RSG-Belgium.
 *
 * Provides a contact form and alternative contact methods for visitors.
 */

import { Metadata } from 'next';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: 'Contact Us | RSG Belgium',
  description: 'Send your questions, suggestions, or feedback to RSG-Belgium. Use our contact form or find alternative contact methods on this page.',
};

/**
 * Renders the Contact page with a contact form.
 */
export default function ContactPage() {
  return <ContactForm />;
}
