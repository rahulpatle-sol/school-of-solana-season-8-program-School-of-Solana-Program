import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wallet, Send, Copy, Heart } from "lucide-react"
import { AppHero } from "@/components/app-hero"
import React from "react"

const tipOptions: {
  amount: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    amount: "0.1 SOL",
    description: "Small tip to show support ❤️",
    icon: <Heart className="w-8 h-8 text-pink-400" />,
  },
  {
    amount: "0.25 SOL",
    description: "Boost my work and motivation 🚀",
    icon: <Send className="w-8 h-8 text-blue-400" />,
  },
  {
    amount: "0.5 SOL",
    description: "Sponsor level support 💎",
    icon: <Wallet className="w-8 h-8 text-purple-400" />,
  },
]

const extra: {
  label: string
  icon: React.ReactNode
  onClick?: () => void
}[] = [
  {
    label: "Copy My Wallet Address",
    icon: <Copy className="w-5 h-5 text-green-400" />,
  },
  {
    label: "Open in Explorer",
    icon: <ArrowRight className="w-5 h-5 text-blue-400" />,
  },
]

export default function TipDashboard() {
  return (
    <div>
      <AppHero
        title="Support My Work 🫶"
        subtitle="If you enjoy my projects, feel free to send a small tip on Solana."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TIP AMOUNTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tipOptions.map((option) => (
            <Card
              key={option.amount}
              className="h-full flex flex-col transition-all duration-200 ease-in-out group hover:border-primary hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex-row items-center gap-4">
                {option.icon}
                <div>
                  <CardTitle className="group-hover:text-primary transition-colors">{option.amount}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <button className="mt-4 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
                  Send Tip
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EXTRA OPTIONS */}
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>More Options</CardTitle>
              <CardDescription>Tools for sending and verifying your support.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {extra.map((item) => (
                  <li key={item.label}>
                    <button className="w-full flex items-center gap-4 group rounded-md p-2 hover:bg-muted transition">
                      {item.icon}
                      <span className="flex-grow text-muted-foreground group-hover:text-foreground transition">
                        {item.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
