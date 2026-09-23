import { StudioClient } from "@/components/studio/StudioClient";

export default async function StudioPage(props: PageProps<"/studio">) {
  const params = await props.searchParams;
  const product = typeof params.product === "string" ? params.product : undefined;
  return <StudioClient initialSlug={product} />;
}
