export const metadata = {
  title: 'Privacy Policy - Job & Student Portal',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2023';

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Last Updated: {lastUpdated}</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            At Job & Student Portal, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul>
            <li>Create an account or profile</li>
            <li>Apply for jobs</li>
            <li>Post job listings</li>
            <li>Register for events</li>
            <li>Contact us</li>
            <li>Participate in surveys or promotions</li>
          </ul>

          <p>
            The types of information we may collect include:
          </p>
          <ul>
            <li>Personal identifiers (name, email address, phone number)</li>
            <li>Educational information (degree, university, graduation year)</li>
            <li>Professional information (work experience, skills, resume)</li>
            <li>Account credentials</li>
            <li>Communication preferences</li>
          </ul>

          <p>
            We also automatically collect certain information when you visit our website, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data (pages visited, time spent on pages)</li>
            <li>Referral source</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process job applications and match students with employers</li>
            <li>Communicate with you about our services, events, and updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Protect against unauthorized access and ensure the security of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>Employers (for job applicants)</li>
            <li>Students (for employers posting jobs)</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners (with your consent)</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <p>
            We do not sell your personal information to third parties.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>

          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>

          <h2>Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to collect information about your browsing activities and to improve your experience on our website. You can manage your cookie preferences through your browser settings.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our website and updating the "Last Updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p>
            Email: privacy@jobstudentportal.com<br />
            Address: 123 Career Avenue, Suite 456, San Francisco, CA 94103<br />
            Phone: +1 (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  );
}
