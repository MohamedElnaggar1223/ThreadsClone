import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider, SignedIn, currentUser } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Topbar from '@/components/shared/Topbar';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export const metadata = { 
  title: 'Threads', 
  description: 'A Next.js 14 Meta Threads Application',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if(!user) redirect('/sign-in')
  else
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <SignedIn>
            <Topbar />

            <main className='flex flex-row'>
              <LeftSidebar />

              <section className='main-container'>
                <div className="w-full max-w-4xl">
                  <Suspense>
                    {children}
                  </Suspense>
                </div>
              </section>

              <RightSidebar />
            </main>

            <Bottombar />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
