import { BackendRequired } from "@/components/layout/BackendRequired";

export default function AccountPage() {
  return (
    <BackendRequired
      title="Your account"
      body="Orders, wishlist, try-on gallery, RFQs and your business profile live here once you're signed in through Supabase Auth."
    />
  );
}
