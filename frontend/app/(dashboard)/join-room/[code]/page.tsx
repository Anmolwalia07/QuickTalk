import Room from "@/app/Components/Room";
import axios from "axios";

export default async function Page({ params }: { params: { code: string } }) {
  const { code } = params;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_Url}/api/room/${code}`);
    return <Room roomId={code} />;
  } catch (error) {
    return <div className="w-full flex items-center justify-center text-red-700 text-2xl">Room not found or error creating room.</div>;
  }
}
