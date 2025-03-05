import { CalendarFold, Home, LayoutDashboard, Package, Pickaxe, PiggyBank, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Sidebar() {

  return (
    <div className='flex w-full flex-col bg-muted/40'>
      <aside className='fixed inset-y-0 left-0 z-10 w-60 border-r bg-background'>
        <nav className='flex flex-col items-start gap-4 px-2 py-5'>

          <div>
            <Link
              href="#"
              className='flex h-9 w-9 mb-6  shrink-0 items-center justify-center rounded-full'
            >
              {/* Ícone ou conteúdo pode ser inserido aqui */}
            </Link>
          </div>

          <Link
            href="/dashboard"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
          >
            <CalendarFold className='h-5 w-5' />
            <span>Agendamentos</span>
          </Link>

          <Link
            href="/dashboard/clientes"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
          >
            <UserRoundPen className='h-5 w-5' />
            <span>Clientes</span>
          </Link>

          <Link
            href="/dashboard/doctor"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
          >
            <UserRoundPen className='h-5 w-5' />
            <span>Profissional</span>
          </Link>

          <Link
            href="/dashboard/custos"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
          >
            <PiggyBank className='h-5 w-5' />
            <span>Custos</span>
          </Link>

          <Link
            href="/dashboard/servico"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
          >
            <Pickaxe className='h-5 w-5' />
            <span>Serviços</span>
          </Link>


        </nav>


      </aside>
    </div>
  );
}