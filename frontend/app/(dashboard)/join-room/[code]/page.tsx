import Room from "@/app/Components/Room";

export default function Page({ params }: { params: { code: string } }) {
  return <Room roomId={params.code} />;
}
