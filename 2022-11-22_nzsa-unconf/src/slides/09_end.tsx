import React from "react";

import { SocialIcon } from "react-social-icons";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import MastodonLogo from "../components/logos/MastodonLogo";

type socialLinkType = {
  url: string;
  title: string;
  network?: string;
};
const socialLinks: socialLinkType[] = [
  {
    url: "https://twitter.com/tomelliottnz",
    title: "@tomelliottnz",
  },
  {
    url: "https://mastodon.nz/@tomelliott",
    title: "@tomelliott@mastodon.nz",
    network: "mastodon",
  },
  {
    url: "https://github.com/tmelliott",
    title: "@tmelliott",
  },
  {
    url: "https://tomelliott.co.nz",
    title: "tomelliott.co.nz",
    network: "web",
  },
];

// const refs = [
//   <>
//     Elliott, Milne, Li, Simpson, and Sporle (2021).{" "}
//     <em>IDI Search: A web app for searching New Zealand&apos;s IDI.</em>{" "}
//     https://idisearch.terourou.org.
//   </>,
//   <>
//     Elliott, Milne, Roberts, Simpson, and Sporle (2022).{" "}
//     <em>Disclosure Risk Calculator.</em> https://risk.terourou.org.
//   </>,
//   <>
//     Urbanek, S. (2003) "Rserve - A Fast Way to Provide R Functionality to
//     Applications" in{" "}
//     <em>
//       Proc. of the 3rd International Workshop on Distributed Statistical
//       Computing{" "}
//     </em>
//   </>,
// ];

const links = [
  "https://idisearch.terourou.org",
  "https://www.stats.govt.nz/integrated-data/integrated-data-infrastructure",
  "https://nextjs.org",
  "",
  "https://risk.terourou.org",
  "https://www.rforge.net/Rserve",
  "https://www.npmjs.com/package/@tmelliott/react-rserve",
  "https://cran.r-project.org/package=sdcMicro ",
];

const EndSlide = () => {
  return (
    <div className="flex items-center justify-center gap-24">
      <div className="flex flex-col gap-4">
        {/* {refs.map((ref, i) => (
          <div
            key={i}
            className="rounded-lg bg-slate-200 bg-opacity-20 p-2 px-4 shadow"
          >
            {ref}
          </div>
        ))} */}

        <div className="mt-4 px-4">
          {/* print links */}
          {links.map((link, i) =>
            link === "" ? (
              <div key={i} className="mb-4 h-4 border-b border-slate-300"></div>
            ) : (
              <a key={i} href={link} className="block pb-1 text-blue-500">
                {link.replace("https://", "")}
              </a>
            )
          )}
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4 px-8">
          {socialLinks.map((link) => (
            <div key={link.url} className="flex items-center gap-4">
              {link.network ? (
                <>
                  {link.network === "web" && (
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black shadow-lg">
                      <GlobeAltIcon
                        height={24}
                        width={24}
                        color="white"
                        className=""
                      />
                    </div>
                  )}
                  {link.network === "mastodon" && (
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#6364FF] text-white shadow-lg">
                      <MastodonLogo />
                    </div>
                  )}
                </>
              ) : (
                <SocialIcon
                  url={link.url}
                  style={{ height: 40, width: 40 }}
                  className="drop-shadow-lg"
                />
              )}
              {link.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EndSlide;
