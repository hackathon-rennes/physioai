"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Copy, CheckCircle2, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatientStore } from "@/store/usePatientStore";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const questionnaireSchema = z.object({
  // All fields bypassed to optional for Hackathon demo speed.
  gender: z.string().optional(),
  age: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  club: z.string().optional(),
  runningYears: z.coerce.number().optional(),
  weeklyVolume: z.coerce.number().optional(),
  specialty: z.string().optional(),
  recentChanges: z.string().optional(),
  shoes: z.string().optional(),
  minimalistIndex: z.coerce.number().optional(),
  hasOrthotics: z.boolean().optional(),
  orthoticsAge: z.coerce.number().optional(),
  orthoticsReason: z.string().optional(),
  medicalHistory: z.string().optional(),
  hasInjuries: z.boolean().optional(),
  injuryZone: z.string().optional(),
  injuryDate: z.string().optional(),
  injuryStatus: z.string().optional(),
  expectations: z.string().optional(),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

const defaultValues: Partial<QuestionnaireFormValues> = {
  gender: "H",
  age: '' as any,
  height: '' as any,
  weight: '' as any,
  club: '',
  runningYears: '' as any,
  weeklyVolume: '' as any,
  specialty: '',
  recentChanges: '',
  shoes: '',
  minimalistIndex: '' as any,
  hasOrthotics: false,
  orthoticsAge: '' as any,
  orthoticsReason: '',
  medicalHistory: '',
  hasInjuries: false,
  injuryZone: '',
  injuryDate: '',
  injuryStatus: "en cours",
  expectations: '',
};

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function QuestionnaireForm() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || "0";
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchHasOrthotics = form.watch("hasOrthotics");
  const watchHasInjuries = form.watch("hasInjuries");
  const { markQuestionnaireCompleted } = usePatientStore();

  async function onSubmit(data: QuestionnaireFormValues) {
    // Si l'utilisateur n'est pas sur la dernière page, ou s'il a cliqué sur "Suivant" avec son clavier,
    // on désactive l'envoi du formulaire. C'est l'étape 5 uniquement qui peut sauvegarder !
    if (step !== 5) {
      return;
    }

    setIsSubmitting(true);
    try {
      // API call to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          status: "QUESTIONNAIRE_COMPLETED",
          notes: JSON.stringify(data), // For hackathon MVP
        }),
      });

      if (response.ok) {
        markQuestionnaireCompleted(patientId);
        alert("Questionnaire sauvegardé en base de données avec succès !");
        router.push("/patients");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="title">Questionnaire d'analyse - Physio Running Lab</h1>
        <p className="hint-text mt-2">Ce questionnaire préalable rapide nous permettra de préparer au mieux votre analyse de course.</p>
        
        {/* Stepper visuel */}
        <div className="flex gap-2 mt-6">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full overflow-hidden transition-all duration-300 ${step >= i ? 'bg-[var(--brand)]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <Card className="border-[var(--line)] shadow-lg shadow-[var(--ink)]/5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader className="bg-[var(--paper)] border-b border-[var(--line)]">
              <CardTitle className="text-[var(--ink)]">
                {step === 1 && "Bloc 1 — Mon Profil & Morphologie"}
                {step === 2 && "Bloc 2 — Ma Pratique de course"}
                {step === 3 && "Bloc 3 — Mon Équipement"}
                {step === 4 && "Bloc 4 — Mes Antécédents"}
                {step === 5 && "Bloc 5 — Mes Attentes"}
              </CardTitle>
              <CardDescription>
                Aidez-nous à mieux comprendre votre profil avant l'analyse clinique au cabinet.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              
              {/* === ETAPE 1 === */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Sexe biologique</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="H" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Homme</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="F" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Femme</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Autre" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Autre</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-3 gap-6">
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Âge (ans)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taille (cm)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poids (kg)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="club" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club ou association (Optionnel)</FormLabel>
                      <FormControl><Input placeholder="Ex: Athlé Santé 35" {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              )}

              {/* === ETAPE 2 === */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="runningYears" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Années de pratique</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weeklyVolume" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume hebdo (km)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="specialty" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécialité (Distance/Discipline)</FormLabel>
                      <FormControl><Input placeholder="Ex: Semi-marathon, Trail court..." {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="recentChanges" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Changements récents / Entraînement (Optionnel)</FormLabel>
                      <FormControl><Textarea placeholder="Volume, intensité augmentée..." {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              )}

              {/* === ETAPE 3 === */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="shoes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chaussures utilisées</FormLabel>
                        <FormControl><Input placeholder="Ex: Hoka Clifton 9" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="minimalistIndex" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indice minimaliste</FormLabel>
                        <FormControl><Input type="number" placeholder="0 - 100%" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  {/* Logique conditionnelle (Orthèses) */}
                  <FormField control={form.control} name="hasOrthotics" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[var(--line)] p-4 bg-[var(--paper)]">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Port d'orthèses plantaires</FormLabel>
                        <FormDescription>Utilisez-vous des semelles orthopédiques pour courir ?</FormDescription>
                      </div>
                    </FormItem>
                  )} />

                  {watchHasOrthotics && (
                    <div className="grid grid-cols-2 gap-6 pl-4 border-l-2 border-[var(--brand)] animate-in fade-in zoom-in-95">
                      <FormField control={form.control} name="orthoticsAge" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ancienneté (mois)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="orthoticsReason" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motif de la prescription</FormLabel>
                          <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  )}
                </div>
              )}

              {/* === ETAPE 4 === */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                  <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antécédents médicaux</FormLabel>
                      <FormControl><Textarea placeholder="Troubles divers..." {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />

                  {/* Logique conditionnelle (Blessures) */}
                  <FormField control={form.control} name="hasInjuries" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[var(--line)] p-4 bg-[var(--status-red)]/5">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-[var(--status-red)]">Blessures liées à la course à pied</FormLabel>
                      </div>
                    </FormItem>
                  )} />

                  {watchHasInjuries && (
                    <div className="p-4 bg-[var(--paper)] rounded-lg border border-[var(--line)] space-y-4 animate-in fade-in zoom-in-95">
                      <h4 className="overline-text">Saisie détaillée</h4>
                      <FormField control={form.control} name="injuryZone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone touchée</FormLabel>
                          <FormControl><Input placeholder="Genou, Tendon d'Achille..." {...field} value={field.value || ""} /></FormControl>
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="injuryDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date / Période</FormLabel>
                            <FormControl><Input placeholder="Ex: Mai 2024" {...field} value={field.value || ""} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="injuryStatus" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut actuel</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="en cours" /></FormControl><FormLabel className="font-normal">En cours</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="résolue" /></FormControl><FormLabel className="font-normal">Résolue</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="récidivante" /></FormControl><FormLabel className="font-normal">Récidivante</FormLabel></FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === ETAPE 5 === */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                  <FormField control={form.control} name="expectations" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quelles sont vos attentes vis-à-vis de ce bilan ?</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[150px] bg-white border-[var(--line)] focus-visible:ring-[var(--brand)]" 
                          placeholder="Je souhaite trouver l'origine de ma douleur au genou, améliorer mes performances, changer de foulée..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="bg-[var(--status-green)]/10 text-[var(--status-green)] p-4 rounded-lg flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Fin du formulaire</p>
                      <p className="text-xs mt-1 text-black/70">Merci pour vos réponses ! Celles-ci seront pré-analysées par notre assistant intelligent pour permettre à votre kinésithérapeute d'être encore plus précis et de cibler immédiatement les points clés de votre foulée lors de notre rendez-vous.</p>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>

            <CardFooter className="flex justify-between border-t border-[var(--line)] bg-gray-50/50 p-6 rounded-b-lg">
              <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
                {step > 1 && <ChevronLeft className="w-4 h-4 mr-2" />}
                {step === 1 ? "Sauvegarder et quitter" : "Précédent"}
              </Button>
              
              {step < 5 ? (
                <Button type="button" onClick={(e) => { e.preventDefault(); setStep(s => Math.min(5, s + 1)); }}>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-[var(--brand)] text-white hover:bg-[var(--brand-d)]">
                  <Save className="w-4 h-4 mr-2" />
                  Valider le questionnaire
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <QuestionnaireForm />
    </Suspense>
  );
}