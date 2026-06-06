"use client";

import { usePatientStore } from "@/store/usePatientStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function PatientsDashboardPage() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, selectedPatient, selectPatient } = usePatientStore();

  const { data: dbPatients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/patients`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((p: any) => ({
        id: p.id,
        maiaId: p.maiaId || 'N/A',
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        nextAppointment: p.createdAt,
        questionnaireCompleted: p.assessments?.[0]?.isPreAssessmentDone || false
      }));
    }
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPatients = dbPatients.filter(p => 
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchAnalysis = (patient: any) => {
    selectPatient(patient);
    setIsDialogOpen(true);
  };

  const handleSendQuestionnaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    try {
      // Calling the backend via environment variable (or default to localhost:3001)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/v1/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          scheduledAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert(`Questionnaire envoyé à ${selectedPatient.email}`);
        setIsDialogOpen(false);
      } else {
        throw new Error('Erreur lors de la création du Bilan');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur serveur: N\'oubliez pas de lancer le Backend sur le port 3001 !');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients programmés</h1>
          <p className="text-gray-500">Synchronisé avec Maia - Prochains rendez-vous (Étape 1)</p>
        </div>
        <div className="w-72">
          <Input 
            placeholder="Rechercher un patient..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{patient.firstName} {patient.lastName}</span>
                <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {patient.maiaId}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="text-sm text-gray-600">
                  <p>📅 RDV: {new Date(patient.nextAppointment).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'})}</p>
                  <p>✉️ {patient.email}</p>
                </div>
                
                <Dialog open={isDialogOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) selectPatient(null);
                }}>
                  {!patient.questionnaireCompleted ? (
                  <DialogTrigger 
                    onClick={() => handleLaunchAnalysis(patient)} 
                    className={cn(buttonVariants({ variant: "default" }), "w-full")}
                  >
                    Lancer une analyse
                  </DialogTrigger>
                  ) : (
                    <Button onClick={() => router.push(`/patients/${patient.id}/interview`)} variant="outline" className="w-full bg-[var(--status-green)]/10 text-[var(--status-green)] hover:bg-[var(--status-green)]/20 hover:text-[var(--status-green)] border-[var(--status-green)]">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Questionnaire disponible
                    </Button>
                  )}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Envoyer le questionnaire amont</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      // Redirect to the questionnaire directly to test the new UC-02 Page!
                      router.push(`/patients/${selectedPatient?.id}/questionnaire`);
                    }} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email du patient (pré-rempli via Maia)</Label>
                        <Input id="email" defaultValue={patient.email} />
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                         Mode Hackathon : Confirmer l'envoi vous emmènera directement sur le questionnaire interactif que le patient aurait reçu.
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                        <Button type="submit">Confirmer l'envoi</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Aucun patient trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
