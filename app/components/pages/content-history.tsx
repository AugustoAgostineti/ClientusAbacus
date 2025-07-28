
'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  User, 
  FileText, 
  Eye, 
  ArrowLeft, 
  History,
  AlertCircle,
  ChevronRight,
  Calendar
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ContentHistoryComparison } from './content-history-comparison'

interface ContentHistoryRecord {
  id: string
  version: number
  changedAt: string
  changeReason?: string
  changedFields: string[]
  changedBy: {
    id: string
    name: string
    email: string
    role: string
  }
  previousData: any
  newData: any
  summary: string[]
}

interface ContentHistoryResponse {
  contentId: string
  totalVersions: number
  history: ContentHistoryRecord[]
}

interface ContentHistoryProps {
  contentId: string
  onBack?: () => void
}

export function ContentHistory({ contentId, onBack }: ContentHistoryProps) {
  const { data: session } = useSession()
  const [historyData, setHistoryData] = useState<ContentHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedComparison, setSelectedComparison] = useState<{
    previous: ContentHistoryRecord
    current: ContentHistoryRecord
  } | null>(null)

  useEffect(() => {
    fetchContentHistory()
  }, [contentId])

  const fetchContentHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contents/${contentId}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Content not found')
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view this content history')
        } else {
          throw new Error('Failed to fetch content history')
        }
      }

      const data = await response.json()
      setHistoryData(data)
    } catch (err: any) {
      console.error('Error fetching content history:', err)
      setError(err?.message || 'Failed to load content history')
    } finally {
      setLoading(false)
    }
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'title':
        return <FileText className="h-3 w-3" />
      case 'description':
      case 'caption':
        return <FileText className="h-3 w-3" />
      case 'mediaUrls':
        return <Eye className="h-3 w-3" />
      case 'scheduledDate':
        return <Calendar className="h-3 w-3" />
      case 'assigneeId':
        return <User className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN_AGENCY':
        return 'bg-red-100 text-red-800'
      case 'EMPLOYEE_AGENCY':
        return 'bg-blue-100 text-blue-800'
      case 'CLIENT':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const openComparison = (currentRecord: ContentHistoryRecord, index: number) => {
    if (index < historyData!.history.length - 1) {
      const previousRecord = historyData!.history[index + 1]
      setSelectedComparison({
        previous: previousRecord,
        current: currentRecord
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading history...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!historyData || historyData.history.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Available</h3>
          <p className="text-gray-500">
            This content has not been edited yet, so there's no version history to display.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
            <p className="text-gray-500">
              {historyData.totalVersions} version{historyData.totalVersions !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Version History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {historyData.history.map((record, index) => (
                <div key={record.id} className="relative">
                  {/* Timeline line */}
                  {index < historyData.history.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-px bg-gray-200" />
                  )}

                  <div className="flex space-x-4">
                    {/* Version indicator */}
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-xs font-semibold text-blue-600">
                        v{record.version}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          {/* Header info */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {record.changedBy.name}
                              </span>
                              <Badge className={getRoleColor(record.changedBy.role)}>
                                {record.changedBy.role.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(record.changedAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* Change reason */}
                          {record.changeReason && (
                            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800">
                                <strong>Reason:</strong> {record.changeReason}
                              </p>
                            </div>
                          )}

                          {/* Changed fields */}
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {record.changedFields.map((field) => (
                                <Badge key={field} variant="secondary" className="text-xs">
                                  <span className="mr-1">{getFieldIcon(field)}</span>
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Summary */}
                          {record.summary.length > 0 && (
                            <div className="mb-3">
                              <ul className="text-sm text-gray-600 space-y-1">
                                {record.summary.map((item, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <ChevronRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions */}
                          {index < historyData.history.length - 1 && (
                            <div className="flex justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openComparison(record, index)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Compare Changes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[80vh]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Compare Version {record.version - 1} → {record.version}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <ContentHistoryComparison
                                    previousVersion={historyData.history[index + 1]}
                                    currentVersion={record}
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
