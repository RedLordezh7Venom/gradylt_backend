import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata = {
  title: 'Admin Login - Job Portal',
  description: 'Log in to the admin panel',
};

export default function AdminLoginPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <AdminLoginForm />
    </div>
  );
}
