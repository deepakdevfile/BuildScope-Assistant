import DiscoveryChat from "@/components/DiscoveryChat";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">BuildScope Assistant</p>
        <h1>Describe your idea. We&apos;ll shape the brief.</h1>
        <p className="lead">
          Chat with our assistant about what you want to build. It builds a
          structured brief and an indicative estimate as you go, then hands it
          to Cynbit&apos;s architects.
        </p>
      </section>
      <DiscoveryChat />
    </>
  );
}