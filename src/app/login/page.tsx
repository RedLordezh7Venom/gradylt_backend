import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login - Student Portal',
  description: 'Log in to your student account',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <LoginForm />
    </div>
  );
}
