import Button from "@/components/button/Button";
import { Link } from "react-router-dom";



export default function() {

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base xl:text-xl font-semibold text-green-600">404</p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-800 sm:text-5xl">
                    Page not found
                </h2>
                <p className="mt-6 text-base leading-7 text-slate-500">
                    Sorry, we couldn`t find the page you`re looking for.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/">
                        <Button
                            type="button"
                            label="Go back home"
                            size="md"
                            theme="primary"
                        />
                    </Link>

                    <Link to="/">
                        <Button
                            type="button"
                            label="Contact support"
                            size="md"
                        />
                    </Link>
                </div>
            </div>
        </main>
    )
}