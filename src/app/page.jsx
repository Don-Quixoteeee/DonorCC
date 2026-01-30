// Home page - Redirects to dashboard or login

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white shadow rounded p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">DonorConnect</h1>
        <p className="text-lg text-gray-700 mb-4">A donor retention platform for nonprofits</p>
        <p className="mb-2 text-gray-600">Problem: Nonprofits lose most first-time donors and struggle to convert them into repeat supporters.</p>
        <p className="mb-6 text-gray-600">Solution: DonorConnect helps organizations identify, engage, and retain donors with data-driven insights and automated workflows.</p>
        <Link href="/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 mb-4">Continue to DonorConnect</button>
        </Link>
        <Link href="/why-donorconnect" className="text-blue-600 hover:underline mb-4">Why DonorConnect?</Link>
        <nav className="flex flex-wrap gap-4 justify-center mt-2">
          <Link href="/donors" className="text-blue-600 hover:underline">Donors</Link>
          <Link href="/donations" className="text-blue-600 hover:underline">Donations</Link>
          <Link href="/campaigns" className="text-blue-600 hover:underline">Campaigns</Link>
          <Link href="/segments" className="text-blue-600 hover:underline">Segments</Link>
          <Link href="/workflows" className="text-blue-600 hover:underline">Workflows</Link>
          <Link href="/tasks" className="text-blue-600 hover:underline">Tasks</Link>
        </nav>
      </div>
    </main>
  )
}
