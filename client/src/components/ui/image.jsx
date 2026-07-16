import * as React from "react"
import { cn } from "@/lib/utils"

const FALLBACK_IMAGE_URL = "/ready-car.png" // using a local fallback if needed

const Image = React.forwardRef(
  ({ src, alt, className, style, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src)

    React.useEffect(() => {
      setImgSrc(src)
    }, [src])

    if (!src) {
      return (
        <img
          ref={ref}
          src={FALLBACK_IMAGE_URL}
          alt={alt || "Placeholder"}
          className={cn("w-full h-full object-cover", className)}
          style={style}
          data-empty-image
          {...props}
        />
      )
    }

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt || ""}
        className={cn("w-full h-full object-cover", className)}
        style={style}
        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
        {...props}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }
