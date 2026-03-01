"use client"

import { motion } from "framer-motion"
import { ImageIcon, Brush, Video, Sparkles, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentFiles = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    collaborators: 0,
  },
  {
    name: "UI Animation.mfx",
    app: "MotionFX",
    modified: "Last week",
    icon: <Sparkles className="text-blue-500" />,
    shared: true,
    collaborators: 4,
  },
]

export default function RecentFiles() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Files</h2>
        <Button variant="ghost" className="rounded-2xl">
          View All
        </Button>
      </div>

      <div className="rounded-3xl border">
        <div className="grid grid-cols-1 divide-y">
          {recentFiles.slice(0, 4).map((file) => (
            <motion.div
              key={file.name}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                  {file.icon}
                </div>

                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.app} • {file.modified}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {file.shared && (
                  <Badge
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Users className="mr-1 h-3 w-3" />
                    {file.collaborators}
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                >
                  Open
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}