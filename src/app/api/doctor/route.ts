import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"},{status: 401})
  }

  const { name, phone, email, description } = await request.json();

  try {
    await prismaClient.professional.create({
      data:{
        name,
        phone,
        email,
        description
      }
    })

    return NextResponse.json({ message: "Profissional cadastrado com sucesso!" })

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
    return NextResponse.json({error: "Failed delete customer"},{status: 401})
  }  

  try {
    await prismaClient.professional.delete({
      where:{
        id: userId as string,
      }
    })

    return NextResponse.json({message: 'Profissional deletado com sucesso!'})

  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Failed delete customer"},{status: 401})
  }
 


}