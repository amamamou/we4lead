"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LearnTab() {
  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold">Learn & Grow</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "UI/UX Fundamentals",
          "Digital Illustration",
          "Motion Graphics",
        ].map((course) => (
          <Card key={course} className="rounded-3xl">
            <CardHeader>
              <CardTitle>{course}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Play className="mr-2 h-4 w-4" />
                Start Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}