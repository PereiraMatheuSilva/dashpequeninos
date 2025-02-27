import Image from 'next/image';
import logoImg from '@/assets/logo.svg';

export default function Home(){
  return(
    <main className='
    flex 
    items-center 
    flex-col 
    justify-center 
    min-h-[calc(100vh-80px)]'>

      <Image 
        src={logoImg}
        alt='Imagem logo do CASA - PEQUENINOS'
        width={600}
        className='max-w-sm md:max-w-xl'
      />
    </main>
  )
}