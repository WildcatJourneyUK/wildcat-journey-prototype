import ukLogo from "../assets/uk-tiny-logo.svg";
import WildcatJourneyLogo from "../assets/wildcat-journey-logo.svg";

export default function Header(){
  return (
    <header className="bg-primary text-white p-4">
      <div className="flex items-center">
        <img className="h-16 border-r pr-8" src={ukLogo} aria-hidden="true" />
        <img className="h-24" src={WildcatJourneyLogo} aria-hidden="true" />
      </div>
    </header>
  )
}