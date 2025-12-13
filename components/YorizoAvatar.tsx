import Image from "next/image"
import clsx from "clsx"

type Mood = "basic" | "thinking" | "asking" | "satisfied" | "expert"
type Size = "xs" | "sm" | "md" | "lg"

const moodSrc: Record<Mood, string> = {
  basic: "/yorizo/yorizo_basic.png",
  thinking: "/yorizo/yorizo_thinking.png",
  asking: "/yorizo/yorizo_asking.png",
  satisfied: "/yorizo/yorizo_satisfied.png",
  expert: "/yorizo/yorizo_expert.png",
}

const sizePx: Record<Size, number> = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 96,
}

type Props = {
  mood?: Mood
  size?: Size
  alt?: string
  className?: string
}

export function YorizoAvatar({ mood = "basic", size = "md", alt = "Yorizo", className }: Props) {
  const dimension = sizePx[size]
  const src = moodSrc[mood] ?? moodSrc.basic

  return (
    <Image
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      style={{ width: dimension, height: dimension }}
      className={clsx("object-contain", className)}
    />
  )
}
