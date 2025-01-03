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
                            <p className=" font-light text-sm lg:max-w-[600px] lg:pt-4">
                                <strong>Exciting Update:</strong> A Commitment to Better Service!
                                <br></br><br></br>
                                Dear Valued Customer,
                                We’re thrilled to have you as part of our journey, and we’re constantly striving to bring you the best experience. To maintain the quality, you deserve and continue improving our services, we’re introducing a Monthly Subscription Fee of TZS 10,000/- starting 03rd, January 2024.
                                <br></br>
                                This small contribution will help us:
                                <ul>
                                    <li> ✅ Enhance our services and offerings.</li>
                                    <li> ✅ Ensure uninterrupted support and reliability.</li>
                                    <li> ✅ Innovate and deliver even better value for you.</li>
                                </ul>
                                <br></br>
                                Your satisfaction is our priority, and we’re committed to making every shilling count by providing unmatched service!
                                <br></br>
                                Thank you for your support and understanding. Together, we’re building something amazing!
                                <br></br>
                                For any inquiries, feel free to contact us at 0736 228228

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
