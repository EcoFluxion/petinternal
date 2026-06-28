// Plain <img> cover — works for both local (/images/...) and external URLs
// (e.g. a cover URL pasted in the /admin editor). The site is a static export
// with image optimization off, so next/image adds no benefit for covers here.
export function CoverImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
