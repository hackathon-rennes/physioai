"use client";

import { use } from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Activity, BrainCircuit, Target, CheckCircle2, ChevronRight, Share2, FileDown } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";

const mockBiomecaniqueData = [
  { metric: "Attaque Talon", diff: 3, status: "warn", value: 75, norm: 60 },
  { metric: "Temps Contact (G)", diff: -1, status: "ok", value: 240, norm: 250 },
  { metric: "Temps Contact (D)", diff: 4, status: "bad", value: 290, norm: 250 },
  { metric: "Cadence (ppm)", diff: -5, status: "bad", value: 155, norm: 170 },
  { metric: "Oscillation Vert.", diff: 2, status: "warn", value: 11, norm: 9 },
];

export default function BilanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Dans un vrai cas, on fetch le patient et le bilan depuis le backend
  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', resolvedParams.id],
    queryFn: async () => ({
      firstName: "Jean",
      lastName: "Dupont",
      metrics: mockBiomecaniqueData,
    })
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Chargement du dossier...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="title">Bilan Clinique — {patient?.firstName} {patient?.lastName}</h1>
          <p className="hint-text mt-1">Étape 8 (Analyse d'Observation) et Étape 9 (Data & IA)</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="text-[var(--brand)] border-[var(--brand)] hover:bg-[var(--brand)]/10">
            <FileDown className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>
          <Button className="bg-[var(--brand)] hover:bg-[var(--brand-d)] text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Publier sur le portail
          </Button>
        </div>
      </div>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="video" className="data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
            <VideoIcon className="w-4 h-4 mr-2" />
            Observation Vidéo
          </TabsTrigger>
          <TabsTrigger value="report" className="data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
            <BrainCircuit className="w-4 h-4 mr-2" />
            Synthèse IA & Bilan
          </TabsTrigger>
        </TabsList>

        {/* ONGLETS OBSERVATION VIDEO (UC-06) */}
        <TabsContent value="video" className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Lecteur Vidéo */}
            <Card className="overflow-hidden border-[var(--line)]">
              <div className="relative bg-black aspect-video flex items-center justify-center group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                {/* Mock image vidéo */}
                <img 
                  src="https://images.unsplash.com/photo-1541534741688-2fc8c6270bf1?q=80&w=1200&auto=format&fit=crop" 
                  alt="Tapis" 
                  className="w-full h-full object-cover opacity-60"
                />
                
                {/* Repères biomec virtuels */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 opacity-70">
                  <div className="w-64 h-32 border-2 border-[var(--lime)] rounded-full border-b-0 rounded-b-none border-dashed mb-4"></div>
                  <p className="text-[var(--lime)] font-bold text-sm bg-black/50 px-3 py-1 rounded">Angle flexion: 42°</p>
                </div>

                <div className={`absolute w-16 h-16 rounded-full bg-[var(--brand)]/80 flex items-center justify-center text-white transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </div>
              </div>
              <CardFooter className="bg-[var(--paper)] py-3 px-4 flex justify-between border-t border-[var(--line)]">
                <span className="text-xs font-bold text-[var(--ink)] uppercase">Vue Sagittale (Droite)</span>
                <span className="text-xs text-[var(--text-muted)] font-mono">00:03:14 / 00:05:00</span>
              </CardFooter>
            </Card>

            {/* Grille d'évaluation */}
            <Card className="border-[var(--line)] flex flex-col">
              <CardHeader className="bg-[var(--paper)] py-4 border-b border-[var(--line)]">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--ink)] flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Grille d'Observation Clinique
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="divide-y divide-[var(--line)]">
                  {/* Ligne 1 */}
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                    <div className="max-w-[50%]">
                      <p className="text-sm font-bold text-[var(--ink)]">Type d'attaque</p>
                      <p className="text-xs text-[var(--text-muted)]">Talon / Médio-pied</p>
                    </div>
                    <div className="flex space-x-2">
                       <button className="w-8 h-8 rounded bg-[var(--paper)] border border-[var(--status-red)] text-[var(--status-red)] font-bold text-xs hover:bg-[var(--status-red)] hover:text-white transition-colors">T</button>
                       <button className="w-8 h-8 rounded bg-[var(--status-green)] border border-[var(--status-green)] text-white font-bold text-xs">M</button>
                    </div>
                  </div>
                  {/* Ligne 2 */}
                  <div className="p-4 flex flex-col space-y-3 hover:bg-gray-50/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-[var(--ink)]">Asymétrie Temps Contact</p>
                      </div>
                      <div className="flex space-x-2">
                         <div className="w-3 h-3 rounded-full bg-[var(--status-green)]"></div>
                         <div className="w-3 h-3 rounded-full bg-[var(--line)]"></div>
                         <div className="w-3 h-3 rounded-full bg-[var(--status-red)]"></div>
                      </div>
                    </div>
                    <Textarea placeholder="Note clinique sur l'asymétrie constatée..." className="h-16 text-xs bg-white resize-none" />
                  </div>
                  {/* Ligne 3 */}
                  <div className="p-4 flex justify-between items-center hover:bg-gray-50/50">
                    <div>
                      <p className="text-sm font-bold text-[var(--ink)]">Oscillation Verticale</p>
                    </div>
                    <div className="flex space-x-2">
                       <div className="w-3 h-3 rounded-full bg-[var(--line)]"></div>
                       <div className="w-3 h-3 rounded-full bg-[var(--status-orange)]"></div>
                       <div className="w-3 h-3 rounded-full bg-[var(--line)]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-[var(--line)] bg-[var(--paper)]">
                <Button className="w-full bg-[var(--ink)] hover:bg-[var(--ink-2)] text-white">Enregistrer l'observation</Button>
              </div>
            </Card>

          </div>
        </TabsContent>

        {/* ONGLETS SYNTHESE IA & BILAN (UC-07) */}
        <TabsContent value="report" className="space-y-6 animate-in fade-in">
          
          {/* Action IA (Foundry Mock) */}
          {!aiGenerated ? (
            <Card className="border-[var(--brand)] border-2 shadow-lg shadow-[var(--brand)]/10 text-center py-16">
              <CardContent>
                <BrainCircuit className="w-16 h-16 text-[var(--brand)] mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Synthétiser les Mouvements avec Microsoft Foundry</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-6">En cliquant ci-dessous, notre agent IA analysera les données d'observation, les capteurs Stryd et le questionnaire pour générer le bilan expert et le plan d'action vulgarisé.</p>
                <Button onClick={() => setAiGenerated(true)} className="bg-[var(--brand)] hover:bg-[var(--brand-d)] text-white px-8">
                  Lancer la Data-Synthèse IA
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Colonne DataViz */}
              <Card className="lg:col-span-1 border-[var(--line)] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[var(--brand-l)] text-[var(--brand-d)] text-[10px] font-bold px-3 py-1 rounded-bl-lg">METRIQUES CLES</div>
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-sm uppercase tracking-widest text-[#5E7480]">Diagnostic Métriques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patient?.metrics} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                        <XAxis type="number" domain={[-10, 10]} hide />
                        <YAxis dataKey="metric" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#16303A' }} width={110} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 14px rgba(14,42,51,.07)' }} />
                        <ReferenceLine x={0} stroke="#E2EAEC" />
                        <Bar dataKey="diff" radius={[0, 4, 4, 0]} barSize={12}>
                          {patient?.metrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`var(--status-${entry.status})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Message Clé Patient */}
                  <div className="mt-6 p-4 bg-[var(--ink)] text-white rounded-xl shadow-inner">
                    <h3 className="text-xs uppercase text-[var(--brand-l)] font-bold tracking-wider mb-2">Message clé (Patient)</h3>
                    <p className="text-sm font-medium leading-relaxed">
                      "Votre attaque talon et une forte asymétrie de contact au pied droit expliquent vos douleurs résiduelles au genou. Pas d'inquiétude, la solution passe par le renforcement et la cadence !"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Colonne Plan d'Action & Édition */}
              <Card className="lg:col-span-2 border-[var(--line)] shadow-md">
                <CardHeader className="bg-[var(--paper)] border-b border-[var(--line)] py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink)] flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[var(--brand)]" />
                    Plan d'Action IA
                  </CardTitle>
                  <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 font-bold rounded-sm flex items-center border border-purple-200">
                    <BrainCircuit className="w-3 h-3 mr-1" /> IA Propose
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Points d'action */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Préconisations (Modifiables)</h4>
                    <div className="space-y-3">
                      <div className="flex items-start bg-white border border-[var(--status-red)]/30 rounded-lg p-3">
                        <div className="w-6 h-6 bg-[var(--status-red)]/10 text-[var(--status-red)] rounded flex items-center justify-center font-bold text-xs shrink-0 mr-3">1</div>
                        <Textarea className="min-h-[60px] border-none shadow-none resize-none bg-transparent p-0 text-sm focus-visible:ring-0 text-[var(--ink)] font-medium" defaultValue="Augmenter la cadence de course de 155 à 165 ppm (utilisation d'un métronome)." />
                      </div>
                      <div className="flex items-start bg-white border border-[var(--status-orange)]/30 rounded-lg p-3">
                        <div className="w-6 h-6 bg-[var(--status-orange)]/10 text-[var(--status-orange)] rounded flex items-center justify-center font-bold text-xs shrink-0 mr-3">2</div>
                        <Textarea className="min-h-[60px] border-none shadow-none resize-none bg-transparent p-0 text-sm focus-visible:ring-0 text-[var(--ink)] font-medium" defaultValue="Renforcement des mollets (Travail excentrique sur marche d'escalier 3x15 rep/jour)." />
                      </div>
                      <div className="flex items-start bg-white border border-[var(--line)] rounded-lg p-3">
                        <div className="w-6 h-6 bg-gray-100 text-gray-500 rounded flex items-center justify-center font-bold text-xs shrink-0 mr-3">3</div>
                        <Textarea className="min-h-[60px] border-none shadow-none resize-none bg-transparent p-0 text-sm focus-visible:ring-0 text-[var(--ink)] font-medium" defaultValue="Assouplissement de la chaîne postérieure." />
                      </div>
                    </div>
                    <Button variant="ghost" className="mt-2 text-xs font-bold text-[var(--brand)]">+ Ajouter une recommandation</Button>
                  </div>
                  
                  {/* Justification Expertise */}
                  <div>
                     <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Justification Clinique (Réservée Kiné)</h4>
                     <Textarea className="min-h-[100px] border-[var(--line)] bg-[var(--paper)] text-sm focus-visible:ring-[var(--brand)] text-[var(--ink)]" defaultValue="Déficit de force tricipitale D > G mesuré par dynamométrie. Associé à un overstriding significatif (cadence base: 155ppm). Risque modéré de syndrome fémoro-patellaire." />
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-[var(--paper)] border-t border-[var(--line)] flex justify-end">
                   <Button className="bg-[var(--lime-d)] hover:bg-[var(--lime)] text-[var(--ink)] font-bold px-8 shadow-md">
                     <CheckCircle2 className="w-4 h-4 mr-2" />
                     Valider le Bilan
                   </Button>
                </CardFooter>
              </Card>

            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Composant interne lucide manquant
function VideoIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
  )
}
