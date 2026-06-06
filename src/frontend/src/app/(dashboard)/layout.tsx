import Link from 'next/link';
import { Activity, Users, FileText, Video, Settings, Bell, UserCircle } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--paper)]">
      {/* Bandeau de navigation gauche (Thème Anthracite/Teal) */}
      <aside className="w-[280px] bg-[var(--ink)] text-white flex flex-col shadow-xl z-20 shrink-0 relative overflow-hidden">
        <div className="h-20 w-full bg-[#1b1b1b] relative flex items-center justify-center shrink-0 border-b border-[var(--ink-2)]">
          <img 
            src="/logo.png" 
            alt="Physio Running Lab" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-[#5E7480]">Menu principal</div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <Link href="/patients" className="flex items-center px-4 py-3 rounded-xl bg-[var(--ink-2)] text-white font-medium transition-all duration-200 border-l-4 border-[var(--brand)] shadow-sm">
            <Users className="w-5 h-5 mr-3 text-[var(--brand)]" />
            Dossiers Patients
          </Link>
          <Link href="/bilans" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[var(--ink-2)] hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-gray-500">
            <FileText className="w-5 h-5 mr-3" />
            Bilans en cours
          </Link>
          <Link href="/videos" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[var(--ink-2)] hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-gray-500">
            <Video className="w-5 h-5 mr-3" />
            Vidéos Cliniques
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--ink-2)]">
          <Link href="/settings" className="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[var(--ink-2)] hover:text-white transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Paramétrages
          </Link>
        </div>
      </aside>

      {/* Surface Principale */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Haut */}
        <header className="h-20 bg-[var(--ink)] border-b border-[var(--ink-2)] flex items-center px-8 justify-between shrink-0 shadow-sm z-0">
          <div className="flex items-center">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Espace Kinésithérapeute</h2>
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
