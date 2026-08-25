import { cn } from "@/lib/utils"

export const LampContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full border-y border-slate-800 z-0",
        className
      )}
    >
      <div className="relative z-50 flex min-h-[32rem] flex-col items-center justify-center px-5">
        {children}
      </div>
    </div>
  )
}