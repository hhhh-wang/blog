import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/BlogPostItem/Container'

export default function BlogPostItemContainer({ children, className }: Props): JSX.Element {
  const { frontMatter, assets, metadata } = useBlogPost()
  const { withBaseUrl } = useBaseUrlUtils()
  const image = assets.image ?? frontMatter.image
  const { permalink } = metadata
  const { isBlogPostPage } = useBlogPost()

  const content = (
    <>
      {image && (
        <>
          <meta itemProp="image" content={withBaseUrl(image, { absolute: true })} />
          <div className={'absolute inset-0 z-1 h-[224px]'}>
            <div
              className="size-full rounded-[var(--ifm-pagination-nav-border-radius)] bg-center bg-cover bg-no-repeat"
              style={{
                WebkitMaskImage: 'linear-gradient(180deg, #fff -17.19%, #00000000 92.43%)',
                maskImage: 'linear-gradient(180deg, #fff -17.19%, #00000000 92.43%)',
                backgroundImage: `url("${image}")`,
              }}
            />
          </div>
          <div style={{ height: '120px' }} />
        </>
      )}
      {children}
    </>
  )

  if (isBlogPostPage) {
    return (
      <article
        className={cn('relative px-4 pt-4 pb-3 lg:px-4', className)}
        itemProp="blogPost"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        {content}
      </article>
    )
  }

  return (
    <Link
      href={permalink}
      className={cn(
        'group/blog relative block px-4 pt-4 pb-3 lg:px-4 hover:no-underline',
        className
      )}
    >
      {content}
    </Link>
  )
}
