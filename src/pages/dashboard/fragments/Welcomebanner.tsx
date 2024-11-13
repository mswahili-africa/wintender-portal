import bgImage from "@/assets/images/img-dropbox-bg.svg";
import welcomeImage from "@/assets/images/welcome-banner.png";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";

export default function WelcomeBanner() {
    const auth  = useSnapshot(authStore);

    return (
        <div className="w-full">
            <div className="bg-green-600 lg:w-full bg-gradient-to-r from-indigo-500 rounded-xl text-white bg-cover"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundRepeat:"no-repeat",
                    backgroundSize:"100%"
                }}
                >
                <div className="flex justify-between">
                    <div className="flex flex-col p-5 lg:gap-1">
                        <div>
                            <h1 className=" font-semibold text-2xl">
                                { auth.user?.role.includes("Vendor") ? "Vendor Information" : "APPLY. WIN. EXECUTE." }
                            </h1>
                            <p className=" font-light text-sm lg:max-w-[600px] lg:pt-4">
                            We're thrilled to have you back! Welcome to Wintender Gen.2. We're excited to introduce the second generation of our service, designed to help you reach your goals more easily.
                            </p>
                        </div>
                    </div>
                    <div className="lg:block hidden">
                        <img src={welcomeImage} alt="" />
                    </div>
                </div>
            </div>  
        </div>
    );
};
