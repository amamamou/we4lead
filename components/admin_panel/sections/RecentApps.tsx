"use client"

import { motion } from "framer-motion"
import { Star, ImageIcon, Brush, Video } from "lucide-react"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/* Same sample data as original */
const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    recent: true,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    recent: true,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    recent: true,
  },
]

export default function RecentApps() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Apps</h2>
        <Button variant="ghost" className="rounded-2xl">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {apps
          .filter((app) => app.recent)
          .map((app) => (
            <motion.div
              key={app.name}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      {app.icon}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-2xl"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <CardTitle className="text-lg">
                    {app.name}
                  </CardTitle>
                  <CardDescription>
                    {app.description}
                  </CardDescription>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="secondary"
                    className="w-full rounded-2xl"
                  >
                    Open
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
      </div>
    </section>
  )
}