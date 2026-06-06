"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// ...
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BrainCircuit, CheckCircle2, ChevronRight, X, UserCog, Stethoscope, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface QuestionSuggestion {
  id: string;
  text: string;
  kept: boolean;
  isEditing: boolean;
}

const getPreProfil = (patient: any) => {
  if (patient?.assessments?.[0]?.notes) {
    try {
      const notes = JSON.parse(patient.assessments[0].notes);
      const expectations = notes.expectations ? notes.expectations : "Aucune attente exprimée.";
      return {
        summary: `Patient ${notes.gender || ''} - Attentes : ${expectations.substring(0, 50)}...`,
        alerts: notes.hasInjuries ? [`Blessure déclarée (${notes.injuryStatus} / ${notes.injuryZone})`] : [],
        focus: "À creuser avec le patient."
      };
    } catch (e) {}
  }
  return { summary: "Non renseigné.", alerts: [], focus: "" };
};

const initialQuestions: QuestionSuggestion[] = [
  { id: "q1", text: "Depuis combien de temps précisément avez-vous transité vers ce nouveau modèle de chaussures ?", kept: true, isEditing: false },
  { id: "q2", text: "La douleur au genou intervient-elle plutôt en phase de poussée ou à l'impact ?", kept: true, isEditing: false },
  { id: "q3", text: "Avez-vous effectué des renforcements des ischio-jambiers récemment ?", kept: true, isEditing: false },
];

function InterviewContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || "0";
  const router = useRouter();
  
  // Dans un vrai cas, on irait lire les réponses (notes JSON) du Assessment DRAFT pour enrichir cette page
  const { data: patient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/patients/${patientId}`);
      if (!res.ok) return { firstName: "Patient", lastName: "Inconnu", assessments: [] };
      return await res.json();
    }
  });

  const [questions, setQuestions] = useState<QuestionSuggestion[]>([]);

  // Au chargement du patient, si l'IA a été lancée ou vient de se finir, on injecte ses questions !
  useEffect(() => {
    if (patient?.assessments?.[0]?.aiQuestions) {
      try {
        const parsed = JSON.parse(patient.assessments[0].aiQuestions);
        if (parsed.questions) setQuestions(parsed.questions);
      } catch(e) {}
    }
  }, [patient]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [differentialReady, setDifferentialReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // GESTION ETAPE 2 : IA + Questions
  const isIaDone = patient?.assessments?.[0]?.isPreProfilIADone || false;

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/assessments/${patientId}/generate-ai-profil`, { method: 'POST' });
      if (res.ok) window.location.reload();
    } catch (e) {}
    setIsGeneratingAI(false);
  };

  const toggleKeepQuestion = (id: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, kept: !q.kept } : q));
  };
  
  const toggleEditQuestion = (id: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, isEditing: !q.isEditing } : q));
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, text } : q));
  };

  const addQuestion = () => {
    const newId = `q${Date.now()}`;
    setQuestions([...questions, { id: newId, text: "Nouvelle question...", kept: true, isEditing: true }]);
  };

  // SOUMISSION FINALE ETAPE 3
  const handleSaveInterview = async () => {
    setIsSaving(true);
    // Simulation enregistrement API du diagnostic
    setTimeout(() => {
      setIsSaving(false);
      alert("Interview sauvegardée et Diagnostic Différentiel validé.");
      // Normalement, ça enchaine vers l'étape 4 (Tests import CSV)
      // Pour la démo, on revient au dashboard ou on passe à la page Bilan/Vidéo
      router.push('/patients'); 
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      {/* HEADER PAGE */}
      <div>
        <h1 className="title">Étape 2 & 3 — Interview Kiné & Diagnostic</h1>
        <p className="hint-text mt-2">Dossier: {patient?.firstName || "Patient"} {patient?.lastName}</p>
        {/* Stepper fictif - Étape 2/3 Actives */}
        <div className="flex gap-2 mt-4">
          <div className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 bg-[var(--status-green)] opacity-50" />
          <div className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 bg-[var(--brand)]" />
          <div className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 bg-[var(--brand)]" />
          <div className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 bg-gray-200" />
          <div className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 bg-gray-200" />
        </div>
      </div>

      {/* BANDEAU GESTION IA / EXPERT */}
      <div className="flex items-center px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg shadow-sm">
        <UserCog className="w-5 h-5 mr-3 shrink-0" />
        <span className="text-sm font-semibold tracking-wide">
          Intelligence Supervisée : <span className="font-normal opacity-90">Vous avez la main sur chaque suggestion.</span>
        </span>
      </div>

      <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95">

        {!isIaDone ? (
          <div className="w-full">
            <Card className="border-[var(--brand)] border-2 shadow-lg shadow-[var(--brand)]/10 text-center py-16">
              <CardContent>
                <BrainCircuit className="w-16 h-16 text-[var(--brand)] mx-auto mb-4 " />
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Pré-Profil non réalisé</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto mb-6">
                  Le patient a complété son questionnaire. Avant l'interview en séance, demandez à notre Intelligence Artificielle de scanner les réponses pour cibler les points de vigilance et vous suggérer les meilleures questions.
                </p>
                <Button disabled={isGeneratingAI} onClick={handleGenerateAI} className="bg-[var(--brand)] hover:bg-[var(--brand-d)] text-white px-8">
                  Lancer l'analyse du Questionnaire
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : ( 

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLONNE GAUCHE : LE PRE-PROFIL IA (Etape 2) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-[var(--brand)] shadow-md shadow-[var(--brand)]/5 animate-in fade-in slide-in-from-left-4">
              <CardHeader className="bg-[var(--brand-l)]/40 rounded-t-lg border-b border-[var(--brand-l)] pb-4">
                <CardTitle className="text-sm font-bold flex items-center text-[var(--ink)]">
                  <BrainCircuit className="w-4 h-4 mr-2 text-[var(--brand)]" />
                  Pré-profil IA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Synthèse</span>
                  <p className="text-sm font-medium text-[var(--ink)] mt-1">{getPreProfil(patient).summary}</p>
                </div>
                <div className="bg-[var(--status-red)]/5 border-l-2 border-[var(--status-red)] pl-3 py-1">
                  <span className="text-[10px] font-bold uppercase text-[var(--status-red)] tracking-wider">Points de vigilance</span>
                  <ul className="text-xs text-[var(--ink)] mt-1 space-y-1 list-disc list-inside">
                    {getPreProfil(patient).alerts.map((alert, i) => <li key={i}>{alert}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Axe d'interview suggéré</span>
                  <p className="text-sm font-medium text-[var(--brand-d)] mt-1">{getPreProfil(patient).focus}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COLONNE DROITE : LA TRAME D'INTERVIEW (Etape 2 -> 3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[var(--line)] shadow-sm animate-in fade-in">
              <CardHeader className="border-b border-[var(--line)] pb-4">
                <CardTitle className="text-base font-bold flex items-center text-[var(--ink)]">
                  <FileQuestion className="w-5 h-5 mr-3 text-[var(--text-muted)]" />
                  Trame d'interview clinique
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="hint-text mb-4">Ces questions ont été générées d'après le questionnaire du patient. Cochez/décochez ou modifiez-les avant l'échange.</p>
                
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className={`flex items-start p-3 border rounded-md transition-all ${q.kept ? 'border-[var(--brand)] bg-[var(--brand-l)]/10' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                      <Checkbox 
                        checked={q.kept} 
                        onCheckedChange={() => toggleKeepQuestion(q.id)} 
                        className={`mt-1 mr-3 ${q.kept ? 'data-[state=checked]:bg-[var(--brand)] data-[state=checked]:border-[var(--brand)]' : ''}`}
                      />
                      <div className="flex-1">
                        {q.isEditing ? (
                          <Textarea 
                            value={q.text} 
                            onChange={(e) => updateQuestionText(q.id, e.target.value)}
                            onBlur={() => toggleEditQuestion(q.id)}
                            className="min-h-[40px] mt-0 text-sm focus-visible:ring-[var(--brand)] border-[var(--brand)] border-2 bg-white"
                            autoFocus
                          />
                        ) : (
                          <p onClick={() => q.kept && toggleEditQuestion(q.id)} className={`text-sm ${q.kept ? 'text-[var(--ink)] cursor-text' : 'text-gray-400 line-through'}`}>
                            {q.text}
                          </p>
                        )}
                      </div>
                      {q.kept && !q.isEditing && (
                        <button onClick={() => toggleKeepQuestion(q.id)} className="ml-2 text-gray-400 hover:text-[var(--status-red)]">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button variant="ghost" onClick={addQuestion} className="text-[var(--brand)] hover:text-[var(--brand-d)] hover:bg-[var(--brand-l)]/30 text-xs font-bold">
                    + Ajouter une question
                  </Button>
                </div>
              </CardContent>
              
              {!interviewStarted && (
                <CardFooter className="bg-[var(--paper)] border-t border-[var(--line)] p-4 flex justify-end">
                  <Button onClick={() => setInterviewStarted(true)} className="bg-[var(--brand)] text-white hover:bg-[var(--brand-d)] px-8 shadow-md">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Démarrer l'interview avec le patient
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* --- FIN COLONNE DROITE --- */}
            </div>
          </div>
        )}

        {/* LA PRISE DE NOTES ET DIAGNOSTIC (Etape 3 active) */}
        {interviewStarted && (
          <Card className="border-[var(--line)] shadow-md animate-in fade-in slide-in-from-bottom-4 zoom-in-95">
            <CardHeader className="bg-[var(--ink)] text-white rounded-t-lg">
                <CardTitle className="text-base font-bold flex items-center">
                  Compte rendu & Diagnostic (En direct)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="text-sm font-bold text-[var(--ink)] mb-2 block">Notes brutes de l'interview</label>
                <Textarea 
                  className="min-h-[120px] bg-[var(--paper)] focus-visible:ring-[var(--brand)]" 
                  placeholder="Le patient ressent une barre sous-rotulienne après 6km. La transition des chaussures s'est faite il y a 2 mois brutalement..."
                />
                <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" onClick={() => setDifferentialReady(true)} className="text-xs border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand-l)]/30">
                      <BrainCircuit className="w-3 h-3 mr-2" />
                      Traduire en Diagnostic Différentiel
                    </Button>
                </div>
              </div>

              {/* MATRICE DIAGNOSTIQUE DIFFERENTIELLE */}
              {differentialReady && (
                <div className="space-y-4 pt-4 border-t border-[var(--line)] animate-in fade-in zoom-in-95">
                  <h4 className="overline-text">Matrice de Pondération</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-3">L'IA de Foundry a détecté 2 hypothèses majeures basées sur vos notes et le profil patient. Validez ou invalidez :</p>
                  
                  <div className="space-y-3">
                    {/* Hypothese 1 */}
                    <div className="border border-[var(--status-orange)]/50 bg-orange-50/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-[var(--ink)] text-sm">Syndrome de l'essuie-glace</span>
                        <span className="bg-[var(--status-orange)] text-white text-[10px] font-bold px-2 py-0.5 rounded">+++ Très probable</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mb-3">Signes contributifs: Sexe H, Transition chaussures, Douleur extérieure du genou &gt; 6km</p>
                      <div className="flex border-t border-orange-200 pt-2 space-x-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs flex-1 text-[var(--status-green)] border-[var(--status-green)] bg-[var(--status-green)]/10 hover:bg-[var(--status-green)] hover:text-white">Valider hypothèse</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 text-gray-500 hover:text-[var(--status-red)]">Rejeter</Button>
                      </div>
                    </div>

                    {/* Hypothese 2 */}
                    <div className="border border-[var(--line)] bg-[var(--paper)] rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-[var(--ink)] text-sm">Fracture de la rotule</span>
                        <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded">+ Possible</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mb-3">Signes contributifs: Choc violent récent sur le genou, chute en avant</p>
                      <div className="flex border-t border-gray-200 pt-2 space-x-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs flex-1 border-gray-300 text-gray-600 hover:text-[var(--status-green)] hover:border-[var(--status-green)]">Valider hypothèse</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 text-gray-500 hover:text-[var(--status-red)] hover:bg-red-50">Rejeter</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {differentialReady && (
              <CardFooter className="bg-[var(--paper)] border-t border-[var(--line)] p-4 flex justify-between">
                <Button variant="ghost" className="text-gray-500">Précédent</Button>
                <Button onClick={handleSaveInterview} disabled={isSaving} className="bg-[var(--brand)] hover:bg-[var(--brand-d)] text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Enregistrer et passer aux Tests Physiques
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="h-20 bg-[var(--ink)] border-b border-[var(--ink-2)] flex items-center px-8 shrink-0 shadow-sm z-0">
        <a href="/patients" className="hover:opacity-90 transition-opacity">
          <img src="/logo-physio.png" alt="Physio Running Lab" className="h-12 object-contain mr-6" />
        </a>
        <h2 className="text-xl font-extrabold text-white tracking-tight border-l border-[var(--ink-2)] pl-6">Expace Kiné - Intelligence Clinique</h2>
      </header>
      <Suspense fallback={<div className="p-8 text-center text-[var(--ink)]">Chargement du dossier...</div>}>
        <InterviewContent />
      </Suspense>
    </div>
  );
}