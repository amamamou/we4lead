"use client"

import { Search, Upload, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FilesTab() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Files</h2>
        <Button className="rounded-2xl">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search files..."
          className="pl-9 rounded-2xl"
        />
      </div>

      <div className="space-y-3">
        {["BrandDesign.pxm", "Logo.vec", "LaunchVideo.mp4"].map((file) => (
          <div
            key={file}
            className="flex items-center justify-between p-4 border rounded-2xl hover:bg-muted transition"
          >
            <span>{file}</span>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}