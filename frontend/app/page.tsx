import Link from "next/link";

function Page() {
  return (
    <div>
      <h1>Odysseus Project</h1>
      <nav>
        <ul>
          <Link href="/register">Register</Link>
        </ul>
        <ul>
          <Link href="/tripstages">Trip Stages</Link>
        </ul>
        <ul>
          <Link href="/messages">Messages</Link>
        </ul>
      </nav>
    </div>
  );
}

export default Page;
