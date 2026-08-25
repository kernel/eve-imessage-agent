import { Hero } from "@/components/hero"
import { Bubbles } from "@/components/bubbles"
import { CapabilityCard } from "@/components/capability-card"
import { Globe, Lock, MessageCircleHeart, ShieldQuestion } from "lucide-react"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Bubbles />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-20 px-5 py-16 sm:py-24">
        <Hero />

        <section className="flex flex-col gap-5">
          <h2 className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            what a tiny krill can do for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <CapabilityCard
              icon={MessageCircleHeart}
              title="just text it"
              body="krill lives inside your iMessage / SMS. no app, no login — say hi and it says hi back (a little shyly)."
            />
            <CapabilityCard
              icon={Globe}
              title="swims out to the web"
              body="need something looked up? krill drives a real cloud browser to go fetch it from the wider ocean of the internet — no setup, no connecting, always ready to swim out."
            />
            <CapabilityCard
              icon={ShieldQuestion}
              title="softly self-aware"
              body="it second-guesses itself, apologizes too much, and is very aware it is comma-sized. still gets the job done."
            />
            <CapabilityCard
              icon={Lock}
              title="a tidepool of one"
              body="this krill only answers your number. text it from anywhere else and it just... doesn't reply. no strangers, no queue."
            />
          </div>
        </section>

        <footer className="flex flex-col items-center gap-1 pb-4 text-center">
          <p className="font-display text-lg text-accent">krill</p>
          <p className="text-sm text-muted-foreground text-balance">
            a very small creature with very big feelings about open water.
          </p>
        </footer>
      </div>
    </main>
  )
}
