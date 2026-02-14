/* eslint-disable @typescript-eslint/no-explicit-any */
 'use client'

import React, { useState, useEffect } from 'react'
import { Search, Download, Plus, Trash2, Edit2, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter, ChevronsUpDown, RefreshCw } from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
  // Optional custom renderer for the column cell. If provided, it receives the full row.
  render?: (row: Record<string, unknown>) => React.ReactNode
  // Optional custom td horizontal padding / classes. When provided this replaces the default px classes.
  tdClass?: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  title: string
  onAdd?: () => void
  onEdit?: (item: Record<string, unknown>) => void
  onDelete?: (item: Record<string, unknown>) => void
  onShow?: (item: Record<string, unknown>) => void
  onExport?: () => void
  onRefresh?: () => void
  searchPlaceholder?: string
}

export function DataTable({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onShow,
  onDelete,
  onExport,
  onRefresh,
  searchPlaceholder = 'Rechercher...'
}: DataTableProps) {
  const [refreshing, setRefreshing] = useState(false)
  // keep the onExport prop available for backwards compatibility, but we intentionally
  // don't call it here to avoid parent-side alert() popups. Mark as used to satisfy linter.
  void onExport
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filterColumn, setFilterColumn] = useState<string>('')
  const [filterValue, setFilterValue] = useState<string>('')
  const pageSize = 10
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredData = data.filter(item => {
    const global = search
      ? columns.some(col => col.searchable !== false && String(item[col.key]).toLowerCase().includes(search.toLowerCase()))
      : true

    if (!global) return false

    if (filterColumn && filterValue) {
      const v = String(item[filterColumn] ?? '')
      if (!v.toLowerCase().includes(filterValue.toLowerCase())) return false
    }

    return true
  })

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        const aStr = String(aVal ?? '')
        const bStr = String(bVal ?? '')
        const cmp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' })
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filteredData

  // Pagination
  const totalRecords = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  useEffect(() => {
    // If current page becomes out of range (due to filtering), reset to last page.
    if (page > totalPages) {
      // schedule state update after render to avoid cascading renders
      const t = setTimeout(() => setPage(totalPages), 0)
      return () => clearTimeout(t)
    }
    return
  }, [page, totalPages])

  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalRecords)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // Export visible data (sorted/filtered) to CSV with improved formatting
  const exportToCsv = () => {
    // determine filename: map some common titles to consistent filenames
    const getExportFileName = (titleRaw: string) => {
      const t = String(titleRaw).toLowerCase()
      let base = 'export'
  if (t.includes('universit') || t.includes('institution') || t.includes('institu')) base = 'Institutions'
  else if (t.includes('étudiant') || t.includes('etudiant') || t.includes('student')) base = 'Students'
  else if (t.includes('admin') || t.includes('administrateur')) base = 'Admins'
  else if (t.includes('doctor') || t.includes('doct') || t.includes('praticien')) base = 'Doctors'
  else if (t.includes('rendez') || t.includes('rdv') || t.includes('consult')) base = 'Consultations'
      else {
        // fallback: title as slug then capitalized
        const slug = t.replace(/\s+/g, '_').replace(/[^a-z0-9_\-]/g, '') || 'export'
        base = slug.charAt(0).toUpperCase() + slug.slice(1)
      }
      return base
    }

    // exclude obvious image/logo/avatar columns from export
    const isImageKey = (k: string, label = '') => {
      const key = k.toLowerCase()
      const lbl = String(label).toLowerCase()
      const imageKeywords = ['logo', 'photo', 'avatar', 'picture', 'image']
      return imageKeywords.some(word => key.includes(word) || lbl.includes(word))
    }

    const formatCell = (item: Record<string, unknown>, c: Column) => {
      const raw = item[c.key]

      if (raw !== null && raw !== undefined && raw !== '') {
        if (typeof raw === 'object') {
          const obj: any = raw as any
          if (obj.nom || obj.name) return String(obj.nom ?? obj.name)
          if (obj.prenom || obj.nom) return `${obj.prenom ?? ''} ${obj.nom ?? ''}`.trim()
          return JSON.stringify(raw)
        }
        return String(raw)
      }

      // Heuristics for common related fields when the keyed value is empty
      if ((item as any).prenom || (item as any).nom) return `${(item as any).prenom ?? ''} ${(item as any).nom ?? ''}`.trim()
      if ((item as any).medecin) { const m = (item as any).medecin; return `Dr. ${(m.prenom ?? '')} ${(m.nom ?? '')}`.trim() }
      if ((item as any).etudiant) { const s = (item as any).etudiant; return `${(s.prenom ?? '')} ${(s.nom ?? '')}`.trim() }
      if ((item as any).universite) return (item as any).universite.nom ?? ''
      if ((item as any).photoUrl || (item as any).photo) return String((item as any).photoUrl || (item as any).photo)
      if ((item as any).logoPath || (item as any).logo || (item as any).logoUrl || (item as any).logo_url) return String((item as any).logoPath || (item as any).logo || (item as any).logoUrl || (item as any).logo_url)

      return ''
    }

    try {
      const columnsForExport = columns.filter(c => !isImageKey(c.key, c.label))
      const headers = columnsForExport.map(c => String(c.label).replace(/[\r\n,]+/g, ' ').trim())

      const rows = sortedData.map(item => columnsForExport.map(c => {
        let v = formatCell(item as Record<string, unknown>, c) ?? ''
        v = String(v)
        if (v.includes('"')) v = v.replace(/"/g, '""')
        if (/[",\r\n]/.test(v)) v = `"${v}"`
        return v
      }))
      const lines = [headers.join(','), ...rows.map(r => r.join(','))]
      const csv = lines.join('\r\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
  a.download = `${getExportFileName(title)}_WE4LEAD.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
  <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto justify-start sm:justify-end">
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 border border-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
              aria-label="Ajouter"
            >
              <Plus size={16} className="text-gray-600" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              if (onRefresh) {
                try {
                  setRefreshing(true)
                  const res = onRefresh()
                  if (res && typeof (res as any).then === 'function') await res
                } finally {
                  setRefreshing(false)
                }
              } else {
                // fallback: reset to first page which effectively refreshes the visible data
                setPage(1)
              }
            }}
            className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 border border-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Rafraîchir"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Chargement...' : 'Rafraîchir'}</span>
          </button>

          <button
            type="button"
            onClick={() => { exportToCsv(); /* intentionally do not call parent onExport to avoid parent alerts */ }}
            className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 border border-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            aria-label="Exporter"
          >
            <Download size={16} className="text-gray-600" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-1 border border-gray-100 rounded-md bg-white/0 flex-1 transition-shadow duration-150 focus-within:shadow-sm min-w-0 w-full">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-8 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center border rounded overflow-hidden w-full sm:w-auto">
            <div className="px-2" title="Filtrer">
              <Filter className="w-4 h-4 text-gray-500" />
            </div>
            <select
              value={filterColumn}
              onChange={(e) => { setFilterColumn(e.target.value); setFilterValue('') }}
              className="text-sm px-2 py-1 outline-none w-full sm:w-auto sm:min-w-[140px]"
              aria-label="Filtrer colonne"
            >
              <option value="">Filtrer</option>
              {columns.filter(c => c.searchable !== false).map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {filterColumn && (
            <input
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Filtrer..."
              className="text-sm border rounded px-2 py-1 w-full sm:w-auto"
            />
          )}

          <div className="flex items-center border rounded px-1 w-full sm:w-auto">
            <div className="px-2" title="Trier">
              <ChevronsUpDown className="w-4 h-4 text-gray-500" />
            </div>
            <select
              value={sortKey ?? ''}
              onChange={(e) => { const v = e.target.value; if (v) { setSortKey(v); setSortDir('asc') } else { setSortKey(null) } }}
              className="text-sm px-2 py-1 outline-none w-full sm:w-auto sm:min-w-[140px]"
              aria-label="Trier par"
            >
              <option value="">Trier par</option>
              {columns.filter(c => c.sortable !== false).map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 border rounded text-sm w-full sm:w-auto"
            title={`Ordre: ${sortDir}`}
            aria-label="Changer ordre de tri"
          >
            {sortDir === 'asc' ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>

  <div className="border border-gray-100 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-3 py-2 sm:px-4 sm:py-3 text-left">
                  <div>
                    <button
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className="flex items-center gap-2 font-semibold text-gray-800 text-sm hover:text-gray-700 transition-colors"
                    >
                      {col.label}
                      {col.sortable !== false && sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-800 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={startIndex + idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map(col => {
                  const horizontal = col.tdClass ?? 'px-3 sm:px-4'
                  const raw = item[col.key]
                  const hasValue = raw !== null && raw !== undefined && raw !== ''
                  const cellContent = col.render ? col.render(item) : (hasValue ? String(raw).substring(0, 50) : '—')

                  return (
                    <td key={col.key} className={`${horizontal} py-2 sm:py-3 text-sm text-gray-700`}>
                      {cellContent}
                    </td>
                  )
                })}
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm">
                  <div className="flex items-center gap-2">
                    {onShow && (
                      <button
                          onClick={() => onShow(item)}
                          className="p-1.5 rounded transition-colors hover:bg-gray-100"
                          title="Afficher"
                          aria-label={`Afficher ${String(item['name'] ?? item['id'] ?? '')}`}
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                          className="p-1.5 rounded transition-colors hover:bg-gray-100"
                          title="Modifier"
                          aria-label={`Modifier ${String(item['name'] ?? item['id'] ?? '')}`}
                      >
                        <Edit2 size={16} className="text-gray-700" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded transition-colors hover:bg-red-100"
                          title="Supprimer"
                          aria-label={`Supprimer ${String(item['name'] ?? item['id'] ?? '')}`}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {sortedData.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Aucune donnée
            </div>
          )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          Affichage {totalRecords === 0 ? 0 : startIndex + 1} - {endIndex} sur {totalRecords} enregistrements
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-2"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
            Précédent
          </button>

          {/* Simple numeric buttons - keep clean: show up to 5 pages centered around current */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1
            // show buttons for first, last, and a window around current page
            if (
              totalPages > 7 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(pageNum - page) > 2
            ) {
              // skip rendering this page number to keep UI clean
              // but render ellipses once where appropriate
              if (pageNum === 2 && page > 4) return <span key={pageNum} className="px-2 text-sm text-gray-400">…</span>
              if (pageNum === totalPages - 1 && page < totalPages - 3) return <span key={pageNum} className="px-2 text-sm text-gray-400">…</span>
              return null
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 border rounded text-sm ${pageNum === page ? 'bg-gray-200 text-gray-800 font-semibold' : 'hover:bg-gray-100'}`}
                aria-current={pageNum === page ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-2"
            aria-label="Next page"
          >
            Suivant
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

