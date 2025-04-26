import Link from 'next/link';

export default function FreeLayout({ children }) {
  return (
    <div>
        <nav className='h-10 bg-greyBG'>
            <Link href='/paid'>Home</Link>
            {/*logout placeholder*/}
        </nav>
        <main> 
            {children}
        </main>
    </div>
    
  );
}
