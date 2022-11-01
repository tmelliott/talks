import React from "react";

const DisclosureAppDetails = () => {
  return (
    <div className="container mx-auto mt-12">
      <ol className="list-decimal">
        <li>
          User connects to app, R WebSocket connection initiated (private R
          process)
        </li>
        <li>User uploads data into browser</li>
        <li>
          User chooses variables, sample size, and JS calculates basic stats
        </li>
        <li>
          Optionally, user can upload stripped data (i.e., label information
          removed) to a function environment in their R process
        </li>
        <li>
          R returns a new capability to calcualte summary stats about the
          uploaded data - data is scoped <em>in the function environment</em> so
          need not be reuploaded each time
        </li>
        <li>User can modify inputs to see real-time updates</li>
        <li>
          When browser is closed, WebSocket killed, and the R process containing
          their data completes and dies, releasing the memory (i.e., deleting
          the data)
        </li>
      </ol>
    </div>
  );
};

export default DisclosureAppDetails;
