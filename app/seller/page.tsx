import { BackendRequired } from "@/components/layout/BackendRequired";

export default function SellerPage() {
  return (
    <BackendRequired
      title="Seller dashboard"
      body="Sales, try-on-to-cart conversion, product uploads and RFQs, backed by Supabase Row Level Security so sellers only ever see their own data."
    />
  );
}
