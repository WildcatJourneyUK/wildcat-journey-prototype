import UniversityLogo from '../assets/univeristy-of-kentucky-logo.svg';

export default function Footer(){
  return (
    <footer className="fixed bottom-0 w-full h-60 bg-primary flex flex-col items-center text-white p-4 mt-4">
      <img className=" h-10 m-10" src={UniversityLogo} alt="University of Kentucky Logo"/>
      <div className="flex flex-col gap-4 items-center text-md">
        <p>
          Made with 💙 by {" "}  
          <a className="underline" target="_blank" href="https://www.linkedin.com/in/apaolaoliveira">Paola Oliveira</a>
          {" "} :)
        </p>
        <p>&copy; Wildcat Journey</p>
      </div>
    </footer>
  )
}