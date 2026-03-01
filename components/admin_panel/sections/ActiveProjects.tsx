"use client"

import { motion } from "framer-motion"
import { Users, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
]

export default function ActiveProjects() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Active Projects</h2>
        <Button variant="ghost" className="rounded-2xl">
          View All
        </Button>
      </div>

      <div className="rounded-3xl border">
        <div className="grid grid-cols-1 divide-y">
          {projects.slice(0, 3).map((project) => (
            <motion.div
              key={project.name}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{project.name}</h3>
                <Badge variant="outline" className="rounded-xl">
                  Due {project.dueDate}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <Progress
                  value={project.progress}
                  className="h-2 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {project.members} members
                </div>

                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  {project.files} files
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}