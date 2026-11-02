import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildScope | Cynbit Technologies",
  description:
    "Tell Cynbit what you want to build. Chat with our BuildScope Assistant or use the estimator to get an indicative budget and timeline.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header className="top">
          <div className="wrap top-inner">
            <span className="brand">
              Cynbit<span className="dot">.</span>
            </span>
            <span className="tag">Prototype · BuildScope</span>
          </div>
        </header>
        <main id="main" className="wrap">{children}</main>
        <footer className="wrap foot">
          <p>
            Estimates are indicative and non-binding. Chats may be stored so our
            team can follow up. Final scope and pricing are confirmed after a
            discovery call.
          </p>
        </footer>
      </body>
    </html>
  );
}
