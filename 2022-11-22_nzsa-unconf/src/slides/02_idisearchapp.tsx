import Structure from "../components/Structure";

const IDISearchApp = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="container mx-auto mt-12 flex h-full flex-col gap-8 text-lg">
        <ul className="list-disc">
          <li>Integrated Data Infrastructure</li>
          <li>Contains 10&apos;s thousands variables across NZ agencies</li>
          <li>
            Difficult to know what data is available without having access to it
          </li>
          <li>Need to develop and propose research Q to gain access!</li>
        </ul>

        <ul className="list-disc">
          <li>
            Need a way to make information about the variables inside the IDI
            available to anyone
          </li>
          <li className="list-none text-green-700">
            Step 1: Generate a list of all variables in the IDI
          </li>
          <li className="list-none text-green-700">
            Step 2: Collate that information across multiple DBs into a single,
            organised, searchable list/database
          </li>
          <li className="list-none text-green-700">
            Step 3: Create a simple web app users can use to browse the
            information
          </li>
        </ul>

        <ul className="list-disc">
          <li>A lot of variable names are not very informative</li>
          <li>
            Datalab contains Data Dictionaries containing metadata about
            variables!
          </li>
          <li className="list-none text-green-700">
            Step 4: Output data dictionaries from Datalab
          </li>
          <li className="list-none text-green-700">
            Step 5: Extract information from data dictionaries and merge with
            variable lists
          </li>
          <li className="list-none text-green-700">
            Step 6: Extend app to make use of this new information
          </li>
        </ul>
      </div>

      <Structure type="oneway" />
    </div>
  );
};

export default IDISearchApp;
