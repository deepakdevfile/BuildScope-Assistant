import Link from "next/link";
import Estimator from "@/components/Estimator";

export default function EstimatePage(){
    return (
        <>
            <section>
                <p>Project Estimator</p>
                <h1>Scope your project in two minutes.</h1>
                <p>
                    Pick services, capabilities and timeline to see an indicative budget instantly. Prefer to talk it through? <Link href="/">Chat with the assistant</Link>
                </p>
            </section>
            <Estimator />
        </>
    )
}