import { BackendRequired } from "@/components/layout/BackendRequired";

export default function SignupPage() {
  return (
    <BackendRequired
      title="Create your account"
      body="Signup creates a row in Supabase's profiles table via the on_auth_user_created trigger. Connect Supabase to enable it."
    />
  );
}
