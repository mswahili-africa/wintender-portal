import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { IconPhoneCall, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";


export default function () {

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 relative">
            <div className="text-xs h-fit absolute bottom-2  sm:top-2 flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row justify-end w-full mb-2">
                <a href="tel:0747098558" target="_blank">
                    <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                        <div className="pr-3"><IconPhoneCall size={22} className="text-green-600" stroke={2} /></div>
                        <span>+255 747 098 558</span>
                    </div>
                </a>
                <a href="https://wa.me/+255766028558" target="_blank">
                    <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                        <div className="pr-3"><IconBrandWhatsapp size={22} className="text-green-600" stroke={2} /></div>
                        <span>WhatsApp</span>
                    </div>
                </a>
                <a target="_blank"
                    href="mailto:info@wintender.co.tz"
                    className="flex items-center px-4 flex-row rounded-md hover:bg-slate-100"
                >
                    <IconMail size={22} className="text-green-600 mr-3" stroke={2} />
                    <span>info@wintender.co.tz</span>
                </a>
            </div>
            <div className="w-1/4 xl:w-1/4 p-10 bg-white h-auto rounded-md shadow-sm">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-base md:text-xl xl:text-2xl text-slate-700 font-semibold">Register</h2>

                    <Link to="/login">
                        <span className="text-green-600 text-xs md:text-sm">
                            Already have an account?
                        </span>
                    </Link>
                </div>
                <div>
                    <form className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="firstName" className="block mb-2">
                                First Name

                            </label>
                            <input type="text" className="input-normal" />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block mb-2">
                                Last Name
                            </label>
                            <input type="text" className="input-normal" />
                        </div>

                        <div>
                            <label htmlFor="company" className="block mb-2">
                                Company
                            </label>
                            <input type="text" className="input-normal" />
                        </div>

                        <div>
                            <label htmlFor="Email" className="block mb-2">
                                Email Address
                            </label>
                            <input type="email" placeholder="E-mail address" className="input-normal" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2">
                                Password
                            </label>
                            <input type="password" className="input-normal" />
                        </div>

                        <Button
                            type="submit"
                            label="Register"
                            theme="primary"
                            size="md"
                        // loading={true}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
