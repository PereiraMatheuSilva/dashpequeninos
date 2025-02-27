import Link from 'next/link'
import { FiUser, FiLogOut } from 'react-icons/fi'


export function Header(){
  return(
    <header className='w-full flex items-center px-2 py-4 bg-white h-20'>
      <div>
        <Link href="/">
          <h1 className='font-bold text-2xl pl-1 hover:tracking-widest duration-300'>
            <span className='text-blue-500'>CASA</span> PEQUENINOS
          </h1>
        </Link>



          <Link href='/dashboard'>
           <FiUser size={26} color='#4b5563' />
          </Link>

        <button>
          Sair
        </button>


      </div>
    </header>
  )
}