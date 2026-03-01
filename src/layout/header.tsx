import ukLogo from "../assets/uk-tiny-logo.svg";
import WildcatJourneyLogo from "../assets/wildcat-journey-logo.svg";

export default function Header(){
  return (
    <header className="bg-primary text-white p-8">
      <div className="flex items-center">
        <img className="h-20 border-r pr-8" src={ukLogo} aria-hidden="true" />
        <img className="h-28" src={WildcatJourneyLogo} aria-hidden="true" />
      </div>
    </header>
  )
}