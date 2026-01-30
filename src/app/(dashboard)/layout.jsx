// Dashboard layout - Protected area
import { getSessionUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Gift, TrendingUp, CheckSquare, FolderTree, Workflow } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Donations', href: '/donations', icon: Gift },
  { name: 'Campaigns', href: '/campaigns', icon: TrendingUp },
  { name: 'Segments', href: '/segments', icon: FolderTree },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
]

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              {navigation.map(item => (
                <a key={item.name} href={item.href} className="text-sm font-medium text-gray-700">
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form method="post" action="/api/auth/logout">
              <button type="submit" className="text-sm text-red-600">Logout</button>
            </form>
          </div>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}