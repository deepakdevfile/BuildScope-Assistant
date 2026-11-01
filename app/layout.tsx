import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Discovery | Cynbit Technologies",
  description:
    "Tell Cynbit what you want to build. Chat with our Project Discovery Assistant or use the estimator to get an indicative budget and timeline.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main">Skip to content</a>
        <header>
          <div>
            <span>
              Cynbit<span>.</span>
            </span>
            <span>Prototype · Project Discovery</span>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer>
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
