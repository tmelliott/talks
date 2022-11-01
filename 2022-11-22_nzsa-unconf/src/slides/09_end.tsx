import React from "react";

import QRCode from "react-qr-code";

const refs = [
  <>
    Elliott, Milne, Li, Simpson, and Sporle (2021).{" "}
    <em>IDI Search: A web app for searching New Zealand&apos;s IDI.</em>{" "}
    https://idisearch.terourou.org.
  </>,
  <>
    Elliott, Milne, Roberts, Simpson, and Sporle (2022).{" "}
    <em>Disclosure Risk Calculator.</em> https://risk.terourou.org.
  </>,
];

const EndSlide = () => {
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

      <div className="flex flex-col gap-4">
        {refs.map((ref, i) => (
          <div
            key={i}
            className="rounded-lg bg-slate-200 bg-opacity-20 p-2 px-4 shadow"
          >
            {ref}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndSlide;
