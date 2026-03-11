import UniversityLogo from '../assets/univeristy-of-kentucky-logo.svg';

export default function Footer(){
  return (
    <footer className=" bottom-0 w-full h-60 bg-primary flex flex-col items-center text-white p-4">
      <img className=" h-14 m-6" src={UniversityLogo} alt="University of Kentucky Logo"/>
      <div className="flex flex-col gap-4 items-center">
        <p>
          Made with 💙 by {" "}  
          <a className="underline text-md" target="_blank" href="https://www.linkedin.com/in/apaolaoliveira">Paola Oliveira</a>
          {" "} :)
        </p>
        <p className="text-md">&copy; Wildcat Journey</p>
        <p className="text-md">Independent prototype project. All content is illustrative. Not affiliated with or endorsed by the University of Kentucky.</p>
      </div>
    </footer>
  )
}