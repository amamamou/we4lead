"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CommunityPost {
  id?: string
  title: string
  author: string
  likes: number
  comments: number
  image: string
  time: string
}

interface Props {
  communityPosts?: CommunityPost[]
  onViewAll?: () => void
}

export default function CommunityHighlights({ communityPosts = [], onViewAll }: Props) {
  // show up to 2 provided community posts (no internal sample fallback)
  // show up to 4 provided community posts; if none provided render 4
  // placeholder cards so the layout remains visible while data loads.
  const postsToRender = (communityPosts && communityPosts.length > 0)
    ? communityPosts.slice(0, 4)
    : Array.from({ length: 4 }).map((_, i) => ({
        id: `placeholder-${i}`,
        title: '',
        author: '',
        likes: 0,
        comments: 0,
        image: '/placeholder.svg',
        time: '',
      }))
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Intervenants</h2>
        {onViewAll && (
          <Button size="sm" variant="ghost" className="text-sm" onClick={onViewAll}>
            View all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {postsToRender.map((post, idx) => (
          <motion.div
            key={post.id ?? post.title ?? idx}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="overflow-hidden rounded-3xl p-0">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                {post.title ? (
                  <>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.author}</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                )}
                {/* Removed likes/comments/time per design request; keep layout minimal */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}