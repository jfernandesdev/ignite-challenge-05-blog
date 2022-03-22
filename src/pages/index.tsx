import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { formatDate } from '../utils/formatDate';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

interface PostsProps {
  posts: Post[];
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [prismicNextPage, setPrismicNextPage] = useState('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setPrismicNextPage(postsPagination.next_page);
  }, [postsPagination])

  function handleGetMorePost(): void {
    fetch(prismicNextPage)
    .then(response => response.json())
    .then(data => {
      setPrismicNextPage(data.next_page);
      const newPosts = data.results;

      setPosts([...posts, ...newPosts]);
    })
  }
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postList}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <time>
                    <FiCalendar />
                    {formatDate(post.first_publication_date)}
                  </time>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}

          {prismicNextPage && (
            <div>
              <button 
                type='button' 
                onClick={handleGetMorePost}
                className={styles.btnGetMorePost}  
              >
                Carregar mais posts
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      page: 1,
    }
  );

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      }
    },
    revalidate: 60 * 60 * 8 // 8 hours
  };
};
