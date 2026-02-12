import React from 'react'

type Props = {
  totalHours: number
  saving?: boolean
  saved?: boolean
}

export default function AvailabilitySummary({ totalHours, saving, saved }: Props) {
  return (
    <div className="bg-white/60 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">You are available</h3>
          <p className="text-xs text-gray-500">This week</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{totalHours} hrs</div>
          <div className="text-xs text-gray-500">total</div>
        </div>
      </div>

      <div className="mt-3 flex items-center text-sm">
        {saving ? (
          <span className="text-indigo-600">Saving…</span>
        ) : saved ? (
          <span className="text-green-600">✓ Saved</span>
        ) : (
          <span className="text-gray-500">Changes not saved</span>
        )}
      </div>
    </div>
  )
}
