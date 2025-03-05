import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"},{status: 401})
  }

  const { name, phone, email, address, responsavel } = await request.json();

  try {
    await prismaClient.customer.create({
      data:{
        name,
        phone,
        email,
        address: address ? address: "",
        responsavel: responsavel ? responsavel: "",
      }
    })

    return NextResponse.json({ message: "Cliente cadastrado com sucesso!" })

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
    await prismaClient.customer.delete({
      where:{
        id: userId as string,
      }
    })

    return NextResponse.json({message: 'Cliente deletado com sucesso!'})

  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Failed delete customer"},{status: 401})
  }
 


}

