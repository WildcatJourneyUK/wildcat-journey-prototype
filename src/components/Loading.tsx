import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json"; 

export default function Loading() {
  return (
    <div className="mainContent flex items-center justify-center w-full h-full">
      <Lottie
        animationData={loadingAnimation}
        loop
        className="w-[250px] h-[250px]"
      />
    </div>
  );
}