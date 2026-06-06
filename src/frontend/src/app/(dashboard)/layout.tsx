import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">PhysioAI</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <Link href="/patients" className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
            Patients (Maia)
          </Link>
          <Link href="/bilans" className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            Bilans en cours
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Tableau de bord Kiné</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Dr. Julien</span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
