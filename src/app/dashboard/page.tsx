import { Container } from '@/components/container/index';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar'


export default async function Dashboard(){
  const session = getServerSession(authOptions);

  console.log(session);

  return(
    <Container>
      <div>
        <Sidebar />
        
      </div>
    </Container>
  )
}