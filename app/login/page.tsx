import { BackendRequired } from "@/components/layout/BackendRequired";

export default function LoginPage() {
  return (
    <BackendRequired
      title="Sign in"
      body="Email magic-link and Google sign-in run through Supabase Auth. Connect a Supabase project (section 2 of the plan) to turn this on."
    />
  );
}
