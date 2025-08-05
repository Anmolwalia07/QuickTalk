import Room from "@/app/Components/Room";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; 
  return <Room roomId={code} />;
}
