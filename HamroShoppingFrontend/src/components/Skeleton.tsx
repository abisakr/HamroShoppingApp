import React from 'react'

interface SkeletonProps {
  count?: number
  height?: string
  width?: string
  variant?: 'text' | 'circular' | 'rectangular'
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  height = '20px',
  width = '100%',
  variant = 'rectangular',
  className = '',
}) => {
  const baseClass =
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]'

  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }[variant]

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variantClass} ${className}`}
          style={{ height, width }}
        />
      ))}
    </>
  )
}

export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card space-y-4">
    <Skeleton height="256px" variant="rectangular" />
    <div className="p-4 space-y-3">
      <Skeleton height="20px" count={2} />
      <Skeleton height="24px" width="60%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height="40px" className="flex-1" />
        <Skeleton height="40px" width="40px" variant="circular" />
      </div>
    </div>
  </div>
)

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton height="20px" />
      </td>
    ))}
  </tr>
)
