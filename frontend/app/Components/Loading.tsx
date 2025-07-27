
export default function Loading() {
  return (
    <div
      className={`flex items-center absolute w-full z-50 justify-center h-screen bg-[#ffffffb3]`}
    >
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 "></div>
      <span className="ml-4 text-blue-700 font-medium">Loading...</span>
    </div>
  )
}
