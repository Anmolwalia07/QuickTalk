import ErrorFallback from "@/app/Components/ErrorFallback";
import Room from "@/app/Components/Room";
import axios from "axios";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  try {
    await axios.get(`${process.env.NEXT_PUBLIC_Url}/api/room/${code}`);
    return <Room roomId={code} />;
  } catch (error) {
    return <ErrorFallback />;
  }
}
