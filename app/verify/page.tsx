'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyPage() {
  const [status, setStatus] = useState('Vérification en cours...')

  useEffect(() => {
    const hash = window.location.search
    if (!hash) return setStatus('Lien de vérification invalide.')

    supabase.auth
      .getSessionFromUrl({ storeSession: true })
      .then(({ data, error }) => {
        if (error) setStatus('Erreur lors de la vérification du compte.')
        else setStatus('Votre compte a été vérifié avec succès ! Vous pouvez maintenant vous connecter.')
      })
  }, [])

  return <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">{status}</div>
}
