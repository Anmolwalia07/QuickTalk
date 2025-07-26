import { authOptions } from "@/app/api/lib/auth"
import { getServerSession } from "next-auth"

export default async function page() {
    const session=await getServerSession(authOptions)
    if(session?.user){
        // console.log(session.user)
    }
  return (
    <div>page</div>
  )
}
