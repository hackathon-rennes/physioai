import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)]">
      {/* Surface Principale Sans Sidebar */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Haut */}
        <header className="h-20 bg-[var(--ink)] border-b border-[var(--ink-2)] flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-6">
            <Link href="/patients" className="hover:opacity-90 transition-opacity">
              <img src="/logo-physio.png" alt="Physio Running Lab" className="h-12 object-contain" />
            </Link>
            <div className="h-8 w-px bg-[var(--ink-2)]"></div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Espace Kiné - Accueil</h2>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-[var(--brand)] transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--status-red)] rounded-full border-2 border-[var(--ink)]"></span>
            </button>
            <div className="flex items-center space-x-4 pl-6 border-l border-[var(--ink-2)]">
              <div className="text-right">
                <div className="text-sm font-bold text-white">Dr. Julien</div>
                <div className="text-xs text-[var(--brand)] font-medium">Expert Physio Running</div>
              </div>
              <div className="w-10 h-10 bg-[var(--brand)] rounded-full flex items-center justify-center text-[var(--ink)] font-bold shadow-sm">
                J
              </div>
            </div>
          </div>
        </header>

        {/* Zone de Contenu Scrollable (incluant le Footer) */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="flex-1 p-8">
            {children}
          </div>
          
          {/* Footer - Conforme HDS */}
          <footer className="shrink-0 py-6 px-8 border-t border-[var(--line)] bg-white text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-muted)] mt-auto">
            <p className="font-medium">© {new Date().getFullYear()} Physio Running Lab. Tous droits réservés.</p>
            <div className="space-x-6 mt-3 md:mt-0 flex items-center">
              <span className="flex items-center text-[var(--status-green)] font-semibold">
                <span className="w-2 h-2 bg-[var(--status-green)] rounded-full mr-2"></span>
                Connexion sécurisée (HDS)
              </span>
              <a href="#" className="hover:text-[var(--brand)] transition-colors">Support Clinique</a>
              <a href="#" className="hover:text-[var(--brand)] transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-[var(--brand)] transition-colors">Confidentialité RGPD</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
