import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"},{status: 401})
  }

  const { name, value, tempo, description} = await request.json();

  try {
    await prismaClient.services.create({
      data:{
        name,
        value,
        time: tempo,
        description
      }
    })

    return NextResponse.json({ message: "Serviço cadastrado com sucesso!" })

  } catch (error) {
    return NextResponse.json({error: "Failed crete new customer"},{status: 400})    
  }

}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"},{status: 401})
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("id")

  if(!userId){
    return NextResponse.json({error: "Failed delete Services"},{status: 401})
  }  

  try {
    await prismaClient.services.delete({
      where:{
        id: userId as string,
      }
    })

    return NextResponse.json({message: 'Serviço deletado com sucesso!'})

  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Failed delete Services"},{status: 401})
  }
 


}