import React from "react";

import QRCode from "react-qr-code";
import { SocialIcon } from "react-social-icons";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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
    url: "https://github.com/tmelliott",
    title: "@tmelliott",
  },
  {
    url: "https://tomelliott.co.nz",
    title: "tomelliott.co.nz",
    network: "web",
  },
];
const trrSocialLinks: socialLinkType[] = [
  {
    url: "https://twitter.com/terourou",
    title: "@terourou",
  },
  {
    url: "https://github.com/terourou",
    title: "@terourou",
  },
  {
    url: "https://terourou.org",
    title: "terourou.org",
    network: "web",
  },
];

const TitleSlide = () => {
  return (
    <div className="flex items-center justify-center gap-24">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="rounded bg-white p-4 shadow-lg">
          <QRCode value="https://tomelliott.co.nz/talks/nzsa2022" size={320} />
        </div>
        <a href="https://tomelliott.co.nz/talks/nzsa2022" className="text-xs">
          tomelliott.co.nz/talks/nzsa2022
        </a>
      </div>

      <div className="flex h-full flex-col justify-center gap-8 text-center">
        <div>
          <p className="text-sm italic">A talk for</p>
          <h3 className="font-bold">NZSA UnConference 2022</h3>
          <p className="text-sm italic">at</p>
          <p>University of Auckland</p>
        </div>
        <div>
          <p className="text-sm italic">by</p>
          <h3 className="font-bold">Tom Elliott</h3>
          <p>Te Rourou Tātaritanga</p>
          <p>Victoria University of Wellington</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4 px-8">
          {socialLinks.map((link) => (
            <div key={link.url} className="flex items-center gap-4">
              {link.network === "web" ? (
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black">
                  <GlobeAltIcon
                    height={24}
                    width={24}
                    color="white"
                    className=""
                  />
                </div>
              ) : (
                <SocialIcon url={link.url} style={{ height: 40, width: 40 }} />
              )}
              {link.title}
            </div>
          ))}
        </div>
        <hr className="h-[2px] rounded-full border-0 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 opacity-70" />
        <div className="flex flex-col items-start gap-4 px-8">
          {trrSocialLinks.map((link) => (
            <div key={link.url} className="flex items-center gap-4">
              {link.network === "web" ? (
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black">
                  <GlobeAltIcon
                    height={24}
                    width={24}
                    color="white"
                    className=""
                  />
                </div>
              ) : (
                <SocialIcon url={link.url} style={{ height: 40, width: 40 }} />
              )}
              {link.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TitleSlide;
