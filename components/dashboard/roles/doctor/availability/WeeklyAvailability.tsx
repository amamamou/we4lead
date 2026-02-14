import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DayAvailability from './DayAvailability';
import AvailabilitySummary from './AvailabilitySummary';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Backend expects capitalized French day names
const DAY_MAPPING: Record<string, string> = {
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
  Sunday: 'Dimanche',
};

const FRENCH_TO_ENGLISH: Record<string, string> = {
  Lundi: 'Monday',
  Mardi: 'Tuesday',
  Mercredi: 'Wednesday',
  Jeudi: 'Thursday',
  Vendredi: 'Friday',
  Samedi: 'Saturday',
  Dimanche: 'Sunday',
};

type TimeRange = { start: string; end: string; id: string };

export default function WeeklyAvailability() {
  const [data, setData] = useState<Record<string, TimeRange[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  const totalHours = useMemo(() => {
    let sum = 0;
    Object.values(data).forEach((ranges) => {
      ranges.forEach((r) => {
        const [sh, sm] = r.start.split(':').map(Number);
        const [eh, em] = r.end.split(':').map(Number);
        const start = sh + sm / 60;
        const end = eh + em / 60;
        sum += Math.max(0, end - start);
      });
    });
    return Math.round(sum * 10) / 10;
  }, [data]);

  // Helper to check if an ID is a temporary local ID
  const isTemporaryId = (id: string) => {
    return id.length < 20; // UUIDs are longer than temporary IDs
  };

  // ─── Load availability ────────────────────────────────────────
  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasUnsavedChanges(false);

    const token = localStorage.getItem('supabaseAccessToken');
    if (!token) {
      setError('Aucun token d\'authentification trouvé');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/medecin/creneaux`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Erreur serveur');
        throw new Error(`Erreur ${res.status}: ${errText}`);
      }

      const creneaux: { id: string; jour: string; debut: string; fin: string }[] =
        await res.json();

      const transformed: Record<string, TimeRange[]> = {};

      creneaux.forEach((c) => {
        const englishDay = FRENCH_TO_ENGLISH[c.jour];
        if (englishDay) {
          if (!transformed[englishDay]) transformed[englishDay] = [];
          transformed[englishDay].push({
            id: c.id, // This will be a proper UUID from backend
            start: c.debut,
            end: c.fin,
          });
        }
      });

      setData(transformed);
      console.log('[LOAD] Disponibilités chargées :', transformed);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les disponibilités');
      console.error('[LOAD] Échec :', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Save changes ─────────────────────────────────────────────
  const saveAvailability = useCallback(async () => {
    const token = localStorage.getItem('supabaseAccessToken');
    if (!token) {
      setError('Token manquant');
      console.warn('[SAVE] Token manquant');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      console.group('[SAVE] Début sauvegarde');

      // Fetch current state from backend
      const existingRes = await fetch(`${BACKEND_URL}/medecin/creneaux`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!existingRes.ok) throw new Error('Impossible de lire les créneaux existants');

      const existing = await existingRes.json();
      const operations: Promise<Response>[] = [];

      console.log('[SAVE] État actuel du frontend :', data);

      // ─── CREATE / UPDATE ────────────────────────────────
      for (const [englishDay, ranges] of Object.entries(data)) {
        const jour = DAY_MAPPING[englishDay];
        if (!jour) {
          console.warn(`Jour non reconnu : ${englishDay}`);
          continue;
        }

        for (const range of ranges) {
          const payload = {
            jour,
            debut: range.start.trim(),
            fin: range.end.trim(),
          };

          // Check if this is a new range (temporary ID) or existing one
          if (isTemporaryId(range.id)) {
            // This is a new range - POST
            console.log(`→ Création pour ${jour} ${range.start}-${range.end}`, payload);
            
            operations.push(
              fetch(`${BACKEND_URL}/medecin/creneaux`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              })
            );
          } else {
            // This is an existing range - PUT
            console.log(`→ Mise à jour pour ${jour} ${range.start}-${range.end}`, payload);
            
            operations.push(
              fetch(`${BACKEND_URL}/medecin/creneaux/${range.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              })
            );
          }
        }
      }

      // ─── DELETE removed slots ────────────────────────────
      // Only consider real backend IDs for deletion
      const currentRealIds = new Set(
        Object.values(data)
          .flat()
          .map((r) => r.id)
          .filter(id => !isTemporaryId(id)) // Only include real backend IDs
      );

      for (const ex of existing) {
        if (!currentRealIds.has(ex.id)) {
          console.log(`→ Suppression du créneau : ${ex.id} (${ex.jour} ${ex.debut}-${ex.fin})`);
          operations.push(
            fetch(`${BACKEND_URL}/medecin/creneaux/${ex.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        }
      }

      console.groupEnd();

      if (operations.length === 0) {
        console.log('[SAVE] Aucun changement détecté');
        setSaving(false);
        setSaved(true);
        setHasUnsavedChanges(false);
        setTimeout(() => setSaved(false), 2000);
        return;
      }

      console.log(`[SAVE] Exécution de ${operations.length} opérations...`);

      const results = await Promise.allSettled(operations);

      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        console.error('[SAVE] Échecs :', failed);
        throw new Error(`${failed.length} opération(s) ont échoué`);
      }

      console.log('[SAVE] Succès total');

      // Reload full data to get correct new IDs and confirm deletions
      await loadAvailability();

      setSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('[SAVE] Échec :', err);
    } finally {
      setSaving(false);
    }
  }, [data, loadAvailability]);

  const handleChange = useCallback(
    (day: string, ranges: TimeRange[]) => {
      // Ensure only one time range per day
      const singleRange = ranges.length > 0 ? [ranges[ranges.length - 1]] : [];
      
      setData((prev) => {
        const next = { ...prev, [day]: singleRange };

        if (singleRange.length === 0) {
          delete next[day];
        }

        setHasUnsavedChanges(true);
        setSaved(false);
        setError(null);

        return next;
      });
    },
    []
  );

  const handleCancel = useCallback(() => {
    loadAvailability();
    setHasUnsavedChanges(false);
    setError(null);
  }, [loadAvailability]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Chargement des créneaux...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => {
              setError(null);
              loadAvailability();
            }}
            className="ml-3 text-blue-600 underline hover:text-blue-800"
          >
            Réessayer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-3">
            {DAYS.map((d) => (
              <DayAvailability
                key={d}
                day={d}
                initial={data[d] || []}
                onChange={(ranges) => handleChange(d, ranges)}
                maxRanges={1}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="md:sticky md:top-24">
            <AvailabilitySummary
              totalHours={totalHours}
              saving={saving}
              saved={saved}
            />
            
            {/* Save/Cancel Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={saveAvailability}
                disabled={saving || !hasUnsavedChanges}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  saving || !hasUnsavedChanges
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={saving || !hasUnsavedChanges}
                className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                  saving || !hasUnsavedChanges
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Annuler
              </button>
            </div>
            
            {hasUnsavedChanges && (
              <p className="text-sm text-amber-600 mt-2">
                Modifications non enregistrées
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}