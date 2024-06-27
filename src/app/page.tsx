import { Footer } from '@/components/front-page/Footer';
import { Navbar } from '@/components/front-page/Navbar';
import '@/css/index.css'

export default function Home() {
  return (
    <>
      <Navbar />
      {/* This is the tagline for the main site, where you will see with the first section. */}
      <div className='intro-to-oris'>
        <div className='left'>
            <h1 id='oris-catch-line'>Imagine an open research platform made for researchers, by researchers.</h1>
            <p id='oris-text'>Welcome to Oris.</p>
        </div>
      </div>
      {/* About section */}
      <div className='about-oris'>
        <h1>About Oris</h1>        
        <p>Oris is a platform built for researchers in mind, where they can publish their research and be able to access research without having the headaches associated with accessing or publishing papers.</p>
      </div>
      <Footer />
    </>
  );
}
