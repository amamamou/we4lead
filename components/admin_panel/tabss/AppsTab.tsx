"use client"

import { Search, Download, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppsTab() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold">Creative Apps</h2>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
          <Button className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search apps..."
          className="pl-9 rounded-2xl"
        />
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["PixelMaster", "VectorPro", "VideoStudio", "MotionFX"].map((app) => (
          <Card key={app} className="rounded-3xl hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle>{app}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional creative tool for designers.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="secondary" className="flex-1 rounded-2xl">
                Open
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl">
                <Star className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}