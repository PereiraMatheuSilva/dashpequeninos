'use client'; // Adicione esta linha no topo do arquivo

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { CalendarFold, Home, LayoutDashboard, Package, Pickaxe, PiggyBank, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState(null);

  const handleLinkClick = (content) => {
    setSheetContent(content);
    setOpen(true);
  };

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
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Início</span>)}
          >
            <Home className='h-5 w-5' />
            <span>Inicio</span>
          </Link>

          <Link
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Clientes</span>)}
          >
            <UserRoundPen className='h-5 w-5' />
            <span>Clientes</span>
          </Link>

          <Link
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Agendamentos</span>)}
          >
            <CalendarFold className='h-5 w-5' />
            <span>Agendamentos</span>
          </Link>

          <Link
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Custos</span>)}
          >
            <PiggyBank className='h-5 w-5' />
            <span>Custos</span>
          </Link>

          <Link
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Serviços</span>)}
          >
            <Pickaxe className='h-5 w-5' />
            <span>Serviços</span>
          </Link>

          <Link
            href="#"
            className='flex items-center gap-4 px-2.5 py-2 text-muted-foreground hover:text-foreground'
            prefetch={false}
            onClick={() => handleLinkClick(<span>Conteúdo de Dashboard</span>)}
          >
            <LayoutDashboard className='h-5 w-5' />
            <span>Dashboard</span>
          </Link>

        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <nav>
              {sheetContent}
            </nav>
          </SheetContent>
        </Sheet>

      </aside>
    </div>
  );
}