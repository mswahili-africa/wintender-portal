import { Link } from "react-router-dom";
import Button from "../../components/button/Button";


export default function() {
    
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
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
                            <input type="email" placeholder="E-mail address" className="input-normal"/>
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2">
                                Password
                            </label>
                            <input type="password" className="input-normal"/>
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
