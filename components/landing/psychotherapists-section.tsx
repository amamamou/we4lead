"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

const slides = [
  {
    id: 1,
    title: "Vendors & Manufacturers",
    description:
      "Get paid upfront, empower customers with flexible payments, and leave the collections burden to us. Partner channel approved.",
    image: "/nadia.png",
    institutes: [
      "Siemens AG",
      "Bosch Group",
      "Honeywell International",
      "Schneider Electric",
      "GE Healthcare",
    ],
  },
  {
    id: 2,
    title: "Reseller Partners",
    description: "Cut closing from weeks to minutes with easy financing, seamless checkout, and faster payouts.",
    image: "/nadia.png",
    institutes: [
      "Arrow Electronics",
      "Avnet, Inc.",
      "Ingram Micro",
      "TD Synnex",
      "Digi-Key Electronics",
    ],
  },
]

export function FeaturesSlideshowSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Calculate which slide to show (current only) — show 1 slide total
  const getVisibleSlides = () => {
    const visible = []
    for (let i = 0; i < 1; i++) {
      visible.push(slides[(currentIndex + i) % slides.length])
    }
    return visible
  }

  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-balance max-w-2xl">
            Win-win for your business, partners, and customers
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="space-y-6">
            {getVisibleSlides().map((slide) => (
              <div key={slide.id} className="group flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/2">
                  <div className="rounded-2xl overflow-hidden bg-muted/50">
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>

                  {/* Title under the left image */}
                  <h3 className="text-2xl font-display font-bold mt-4">{slide.title}</h3>
                </div>

                <Card className="md:w-1/2">
                  <CardHeader>
                    <CardDescription className="mb-2">{slide.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Modern, professional list of partner/institute names */}
                    <ul className="mt-2 space-y-3">
                      {slide.institutes?.map((inst) => (
                        <li key={inst} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-primary/90 shrink-0" aria-hidden />
                          <span className="text-base font-medium">{inst}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-end">
                      <Button variant="outline">Report a situation</Button>
                    </div>
                  </CardContent>

                  <CardFooter />
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
