import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import styles from "./index.module.css";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC!" });
  const session = await getServerAuthSession();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          ate<span className={styles.pinkSpan}>Th.at</span>
        </h1>
        <div className={styles.showcaseContainer}>
          <p className={styles.showcaseText}>
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className={styles.authContainer}>
            <p className={styles.showcaseText}>
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className={styles.loginButton}
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPosts = await api.post.getLastWeek()

  return (
    <div className={styles.showcaseContainer}>
      {latestPosts.length === 0 && <p className={styles.showcaseText}>You have no posts yet.</p>}
      {latestPosts.map((post, key) => 
        <p key={key} className={styles.showcaseText}>
          {post.createdAt.toLocaleString()}: {post.name}
        </p>
      )}

      <CreatePost />
    </div>
  );
}
