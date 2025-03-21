import {ReactNode} from 'react'


export function Container({children}:{children:ReactNode}){
  return(
    <div className='w-full flex'>
      {children}
    </div>
  )
}