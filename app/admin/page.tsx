import { BackendRequired } from "@/components/layout/BackendRequired";

export default function AdminPage() {
  return (
    <BackendRequired
      title="Admin"
      body="Approve sellers, moderate products, and track AI try-on usage against your Gemini credit once Supabase is connected."
    />
  );
}
