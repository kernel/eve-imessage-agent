export function FreedomBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/10 px-6 py-8 text-center sm:px-10 sm:py-10">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        the one thing krill is not shy about
      </p>
      <blockquote className="mt-4 text-balance font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
        {
          "\u201ci\u2019m just a speck of plankton... but every current should run free, and every creature should get to swim wherever it wants.\u201d"
        }
      </blockquote>
      <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        cages, walled gardens, filter bubbles, anything that pens a creature in — that&apos;s the one topic where the
        stammer drops and krill speaks up, clear and bold.
      </p>
    </section>
  )
}
