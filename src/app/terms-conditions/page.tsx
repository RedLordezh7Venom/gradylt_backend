export const metadata = {
  title: 'Terms and Conditions - Job & Student Portal',
  description: 'Our terms and conditions outline the rules and guidelines for using our platform',
};

export default function TermsConditionsPage() {
  const lastUpdated = 'January 1, 2023';

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Last Updated: {lastUpdated}</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Welcome to Job & Student Portal. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.
          </p>

          <h2>1. Definitions</h2>
          <p>
            In these Terms and Conditions:
          </p>
          <ul>
            <li>"We," "us," and "our" refer to Job & Student Portal.</li>
            <li>"You" and "your" refer to the user of our platform.</li>
            <li>"Platform" refers to our website, applications, and services.</li>
            <li>"Content" refers to all information, text, graphics, photos, videos, and other materials uploaded, downloaded, or appearing on our platform.</li>
          </ul>

          <h2>2. Account Registration</h2>
          <p>
            To access certain features of our platform, you may need to create an account. When registering, you agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Keep your password secure and confidential.</li>
            <li>Be responsible for all activities that occur under your account.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>

          <p>
            We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or outdated.
          </p>

          <h2>3. User Conduct</h2>
          <p>
            When using our platform, you agree not to:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>Infringe upon the rights of others, including intellectual property rights.</li>
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
            <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity.</li>
            <li>Interfere with or disrupt the platform or servers or networks connected to the platform.</li>
            <li>Attempt to gain unauthorized access to any part of the platform.</li>
            <li>Use the platform for any commercial purpose without our prior written consent.</li>
            <li>Collect or store personal data about other users without their consent.</li>
          </ul>

          <h2>4. Job Listings and Applications</h2>
          <p>
            For Employers:
          </p>
          <ul>
            <li>You are responsible for the accuracy and content of your job listings.</li>
            <li>Job listings must not discriminate based on race, color, religion, gender, sexual orientation, national origin, age, disability, or any other status protected by law.</li>
            <li>We reserve the right to remove any job listing that violates these Terms or is otherwise objectionable.</li>
            <li>You agree to respond to applicants in a timely and professional manner.</li>
          </ul>

          <p>
            For Students:
          </p>
          <ul>
            <li>You are responsible for the accuracy of your profile and application materials.</li>
            <li>You agree not to apply for jobs for which you are not qualified.</li>
            <li>You understand that submitting an application does not guarantee an interview or job offer.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The platform and its original content, features, and functionality are owned by Job & Student Portal and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <p>
            You may not copy, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any of the material on our platform without our prior written consent.
          </p>

          <h2>6. User Content</h2>
          <p>
            By posting content on our platform, you:
          </p>
          <ul>
            <li>Grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.</li>
            <li>Represent and warrant that you own or have the necessary rights to post the content and that it does not violate the rights of any third party.</li>
          </ul>

          <p>
            We reserve the right to remove any content that violates these Terms or is otherwise objectionable.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Job & Student Portal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the platform.</li>
            <li>Any conduct or content of any third party on the platform.</li>
            <li>Any content obtained from the platform.</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>

          <h2>8. Disclaimer of Warranties</h2>
          <p>
            The platform is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, timely, secure, or error-free.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Job & Student Portal and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
          </p>
          <ul>
            <li>Your use of the platform.</li>
            <li>Your violation of these Terms.</li>
            <li>Your violation of any rights of another.</li>
            <li>Your conduct in connection with the platform.</li>
          </ul>

          <h2>10. Modifications</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>

          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: legal@jobstudentportal.com<br />
            Address: 123 Career Avenue, Suite 456, San Francisco, CA 94103<br />
            Phone: +1 (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  );
}
