import Structure from "../components/Structure";

const DisclosureApp = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="container mx-auto mt-12 flex h-full flex-col gap-8 text-lg">
        <ul className="list-disc">
          <li>Disclosure risk: identifying an individual in a sample</li>
          <li>
            Some simple calculations, and others requiring{" "}
            <strong>smcMicro</strong> R package
          </li>
          <li>A shiny app would be OK, but would either require</li>
          <li className="list-none">
            A. User to manually install/set up (including R?)
          </li>
          <li className="list-none">
            B. Hosting on server with no security/privacy controls/guarantees
            ("blackbox")
          </li>
          <li>Preferable solution:</li>
          <li className="list-none">
            1. Do simple calculations in the browser (almost zero risk of
            privacy leak)
          </li>
          <li className="list-none">
            2. Upload data to disposable R process linked to and only accessible
            from the current connection
          </li>
          <li>
            <strong>Rserve</strong>: R package for just this
          </li>
          <li className="list-none">
            JavaScript client creates a WebSocket connection to R server
          </li>
          <li className="list-none">
            R server spawns a private R process connected to the WebSocket -
            inaccessible from anywhere else
          </li>
          <li className="list-none">
            Once the WebSocket closes, R process killed, along with any uploaded
            data/memory allocation
          </li>
        </ul>
      </div>
      <Structure type="twoway" />
    </div>
  );
};

export default DisclosureApp;
