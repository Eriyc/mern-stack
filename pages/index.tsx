import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
type Post = {
  author: string;
  title: string;
  description: string;
  likes: string[];
  likeCount: number;
  timestamp: Date;
};

interface Props {
  posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
  console.log(posts);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>MERN Stack</h1>

        <div className={styles.grid}></div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

Home.getInitialProps = async (ctx) => {
  // Get latest 5 posts for the frontpage
  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'GET',
    body: JSON.stringify({
      amount: 10,
      seen: [],
    }),
  });

  // The data recieved will always come in the Post format from the server
  const posts = (response.json() as unknown) as Post[];
  return {
    posts,
  };
};

export default Home;
