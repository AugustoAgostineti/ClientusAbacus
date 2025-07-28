
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Image as ImageIcon, 
  User, 
  Calendar,
  ArrowRight,
  Plus,
  Minus,
  Eye
} from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow, format } from 'date-fns'

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

interface ContentHistoryComparisonProps {
  previousVersion: ContentHistoryRecord
  currentVersion: ContentHistoryRecord
}

export function ContentHistoryComparison({ 
  previousVersion, 
  currentVersion 
}: ContentHistoryComparisonProps) {
  const isFieldChanged = (field: string) => {
    return currentVersion.changedFields.includes(field)
  }

  const renderTextComparison = (label: string, field: string, oldValue: any, newValue: any) => {
    const hasChanged = isFieldChanged(field)
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">{label}</span>
          {hasChanged && (
            <Badge variant="outline" className="text-xs">Changed</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Previous value */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {previousVersion.version} (Before)
            </div>
            <div className={`p-3 rounded-md border ${hasChanged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-sm ${hasChanged ? 'text-red-800' : 'text-gray-700'}`}>
                {oldValue || <span className="italic text-gray-400">No content</span>}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className={`h-5 w-5 ${hasChanged ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>

          {/* New value */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {currentVersion.version} (After)
            </div>
            <div className={`p-3 rounded-md border ${hasChanged ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-sm ${hasChanged ? 'text-green-800' : 'text-gray-700'}`}>
                {newValue || <span className="italic text-gray-400">No content</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderArrayComparison = (label: string, field: string, oldArray: any[], newArray: any[]) => {
    const hasChanged = isFieldChanged(field)
    const oldSet = new Set(oldArray || [])
    const newSet = new Set(newArray || [])
    
    const added = newArray?.filter(item => !oldSet.has(item)) || []
    const removed = oldArray?.filter(item => !newSet.has(item)) || []
    const kept = oldArray?.filter(item => newSet.has(item)) || []

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">{label}</span>
          {hasChanged && (
            <Badge variant="outline" className="text-xs">Changed</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Previous value */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {previousVersion.version}
            </div>
            <div className="p-3 rounded-md border bg-gray-50 border-gray-200">
              {oldArray?.length > 0 ? (
                <div className="space-y-1">
                  {oldArray.map((item, index) => (
                    <div key={index} className={`text-sm px-2 py-1 rounded ${newSet.has(item) ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-800'}`}>
                      {removed.includes(item) && <Minus className="h-3 w-3 inline mr-1" />}
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No items</span>
              )}
            </div>
          </div>

          {/* New value */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {currentVersion.version}
            </div>
            <div className="p-3 rounded-md border bg-gray-50 border-gray-200">
              {newArray?.length > 0 ? (
                <div className="space-y-1">
                  {newArray.map((item, index) => (
                    <div key={index} className={`text-sm px-2 py-1 rounded ${oldSet.has(item) ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'}`}>
                      {added.includes(item) && <Plus className="h-3 w-3 inline mr-1" />}
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No items</span>
              )}
            </div>
          </div>
        </div>

        {/* Change summary */}
        {hasChanged && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-xs text-blue-800">
              {added.length > 0 && <span className="text-green-600">+{added.length} added</span>}
              {added.length > 0 && removed.length > 0 && <span className="mx-2">•</span>}
              {removed.length > 0 && <span className="text-red-600">-{removed.length} removed</span>}
              {kept.length > 0 && (added.length > 0 || removed.length > 0) && <span className="mx-2">•</span>}
              {kept.length > 0 && <span className="text-gray-600">{kept.length} unchanged</span>}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderMediaComparison = (oldUrls: string[], newUrls: string[]) => {
    const hasChanged = isFieldChanged('mediaUrls')
    const oldSet = new Set(oldUrls || [])
    const newSet = new Set(newUrls || [])
    
    const added = newUrls?.filter(url => !oldSet.has(url)) || []
    const removed = oldUrls?.filter(url => !newSet.has(url)) || []

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">Media Files</span>
          {hasChanged && (
            <Badge variant="outline" className="text-xs">Changed</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Previous media */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {previousVersion.version}
            </div>
            <div className="p-3 rounded-md border bg-gray-50 border-gray-200">
              {oldUrls?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {oldUrls.map((url, index) => (
                    <div key={index} className={`relative ${removed.includes(url) ? 'opacity-50' : ''}`}>
                      <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                        <Image
                          src={url}
                          alt={`Media ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {removed.includes(url) && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                            <Minus className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No media files</span>
              )}
            </div>
          </div>

          {/* New media */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {currentVersion.version}
            </div>
            <div className="p-3 rounded-md border bg-gray-50 border-gray-200">
              {newUrls?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {newUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
                        <Image
                          src={url}
                          alt={`Media ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {added.includes(url) && (
                          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No media files</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDateComparison = (label: string, field: string, oldDate: string | null, newDate: string | null) => {
    const hasChanged = isFieldChanged(field)
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">{label}</span>
          {hasChanged && (
            <Badge variant="outline" className="text-xs">Changed</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {previousVersion.version}
            </div>
            <div className={`p-3 rounded-md border ${hasChanged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-sm ${hasChanged ? 'text-red-800' : 'text-gray-700'}`}>
                {oldDate ? format(new Date(oldDate), 'PPP p') : <span className="italic text-gray-400">Not scheduled</span>}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Version {currentVersion.version}
            </div>
            <div className={`p-3 rounded-md border ${hasChanged ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-sm ${hasChanged ? 'text-green-800' : 'text-gray-700'}`}>
                {newDate ? format(new Date(newDate), 'PPP p') : <span className="italic text-gray-400">Not scheduled</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const previousData = previousVersion.previousData
  const currentData = currentVersion.newData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Version Comparison</h3>
          <p className="text-sm text-gray-500">
            Changes made by {currentVersion.changedBy.name} • {formatDistanceToNow(new Date(currentVersion.changedAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">v{previousVersion.version}</Badge>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <Badge variant="outline">v{currentVersion.version}</Badge>
        </div>
      </div>

      {/* Change reason */}
      {currentVersion.changeReason && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Change Reason</div>
                <div className="text-sm text-gray-600 mt-1">{currentVersion.changeReason}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparisons */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-6 pr-4">
          {/* Title */}
          {renderTextComparison('Title', 'title', previousData.title, currentData.title)}
          
          <Separator />
          
          {/* Description */}
          {renderTextComparison('Description', 'description', previousData.description, currentData.description)}
          
          <Separator />
          
          {/* Caption */}
          {renderTextComparison('Caption', 'caption', previousData.caption, currentData.caption)}
          
          <Separator />
          
          {/* Content Type */}
          {renderTextComparison('Content Type', 'contentType', previousData.contentType, currentData.contentType)}
          
          <Separator />
          
          {/* Platforms */}
          {renderArrayComparison('Platforms', 'platforms', previousData.platforms, currentData.platforms)}
          
          <Separator />
          
          {/* Media Files */}
          {renderMediaComparison(previousData.mediaUrls, currentData.mediaUrls)}
          
          <Separator />
          
          {/* Scheduled Date */}
          {renderDateComparison('Scheduled Date', 'scheduledDate', previousData.scheduledDate, currentData.scheduledDate)}
          
          <Separator />
          
          {/* Client Assignment */}
          {renderTextComparison('Client Assignment', 'assigneeId', 
            previousData.assigneeId ? 'Assigned' : 'Not assigned', 
            currentData.assigneeId ? 'Assigned' : 'Not assigned'
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
