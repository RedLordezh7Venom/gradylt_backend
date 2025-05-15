import SignUpForm from '@/components/SignUpForm';

export const metadata = {
  title: 'Sign Up - Student Portal',
  description: 'Create a new student account',
};

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <SignUpForm />
    </div>
  );
}
