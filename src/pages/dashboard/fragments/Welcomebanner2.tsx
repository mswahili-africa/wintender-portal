import bgImage from "@/assets/images/img-dropbox-bg.svg";
import welcomeImage from "@/assets/images/welcome-banner.png";

export default function WelcomeBanner() {
    return (
        <div className="w-full">
            <div className="bg-green-600 lg:w-full bg-gradient-to-r from-indigo-500 rounded-xl text-white bg-cover"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%"
                }}
            >
                <div className="flex justify-between">
                    <div className="flex flex-col p-5 lg:gap-1">
                        <div>
                            <p className=" font-light text-sm lg:max-w-[900px] lg:pt-4">
                                Exciting <strong>Fundraising Opportunity</strong> for Your Ongoing Projects

                                <br></br><br></br>
                                We are excited to announce a unique opportunity for funding support tailored to ongoing projects in the following sectors:

                                <br></br>
                                This small contribution will help us:
                                <ul>
                                    <li>📍 Real Estate Development</li>
                                    <li>📍 Construction and Infrastructure</li>
                                    <li>📍 Transportation and Logistics</li>
                                </ul>
                                <br></br>
                                We are committed to empowering initiatives that drive progress, foster innovation, and create transformative impacts in these key industries.
                                <br></br>
                                What We Offer:
                                <ul>
                                    <li>✅ Tailored Funding Solutions: Designed to meet the specific needs of projects in your sector.</li>
                                    <li>✅ Industry Expertise: Access to strategic guidance from experienced professionals.</li>
                                    <li>✅ Growth Potential: Funding that accelerates project timelines and expands your reach</li>
                                </ul>
                                <br></br>
                                How to Apply:
                                To take advantage of this opportunity, simply:
                                <br></br>
                                Email us at finance@wintender.tz
                                Message us via WhatsApp at <strong>+255 736 228 228 / 747 098 558</strong>
                                <br></br>
                                Our team will guide you through the application process and provide all necessary details.
                                <br></br>
                                Don’t miss this chance to scale your project and achieve your goals! Contact us today.
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
