import Link from "next/link";
import "/app/globals.css";
function Page() {
  return (
    <div className="home-container">
      <h1>Oddysseus Project</h1>
      <ul className="nav-links">
        <li>
          <Link href="/messages">Messages archive</Link>
        </li>
        <li>
          <Link href="/register">Registration</Link>
        </li>
        <li>
          <Link href="/send-sms">Send sms</Link>
        </li>
        <li>
          <Link href="/generate-report">Generate report</Link>
        </li>
      </ul>
    </div>
  );
}

export default Page;