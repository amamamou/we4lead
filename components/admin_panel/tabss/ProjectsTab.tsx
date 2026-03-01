"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProjectsTab() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Projects</h2>
        <Button className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Website Redesign", progress: 75 },
          { name: "Brand Identity", progress: 90 },
          { name: "Marketing Campaign", progress: 40 },
        ].map((project) => (
          <Card key={project.name} className="rounded-3xl">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={project.progress} className="h-2 rounded-xl" />
              <p className="text-sm mt-2 text-muted-foreground">
                {project.progress}% completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}