export const Welcome = () => {
  return (
    <div className="w-1/2 m-auto flex flex-col gap-5 drop-shadow-md">
      <h1 className="text-2xl font-bold">Finance Manager</h1>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
      <div className="flex gap-3">
        <button className="btn btn-primary">Documentation</button>
        <button className="btn">GitHub</button>
      </div>
    </div>
  );
};
