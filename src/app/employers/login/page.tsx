import EmployerLoginForm from '@/components/EmployerLoginForm';

export const metadata = {
  title: 'Employer Login - Job Portal',
  description: 'Log in to your employer account',
};

export default function EmployerLoginPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <EmployerLoginForm />
    </div>
  );
}
