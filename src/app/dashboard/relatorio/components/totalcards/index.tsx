// components/TotalsCard.tsx
'use client'

import { FC } from 'react'

interface TotalsCardProps {
  title: string
  value: string
  icon: string
}

export const TotalsCard: FC<TotalsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-4xl text-gray-400">
        
      </div>
    </div>
  )
}
