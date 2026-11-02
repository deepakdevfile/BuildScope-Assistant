import Link from "next/link";
import Estimator from "@/components/Estimator";

export const metadata = {
  title: "Project Estimator | Cynbit Technologies",
};

export default function EstimatePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Project Estimator</p>
        <h1>Scope your project in two minutes.</h1>
        <p className="lead">
          Pick services, capabilities and timeline to see an indicative budget
          instantly. Prefer to talk it through?{" "}
          <Link href="/">Chat with the assistant</Link>.
        </p>
      </section>
      <Estimator />
    </>
  );
}
