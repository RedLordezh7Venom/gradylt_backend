import EmployerSignUpForm from '@/components/EmployerSignUpForm';

export const metadata = {
  title: 'Employer Sign Up - Job Portal',
  description: 'Create a new employer account',
};

export default function EmployerSignUpPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <EmployerSignUpForm />
    </div>
  );
}
