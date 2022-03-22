import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import { formatDate } from '../../utils/formatDate';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import styles from './post.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

function readingTimeEstimation(post: Post): number {
  const wordsPerMinute = 200;
  const wordsCount = 
    RichText.asText(
      post.data.content.reduce((acc, data) => [...acc, ...data.body], [])
    ).split(' ').length + 
    RichText.asText(
        post.data.content.reduce((acc, data) => {
          if (data.heading) {
            return [...acc, ...data.heading.split(' ')];
          }
          return [...acc];
        }, [])
    ).split(' ').length;

    const estimatedTime = Math.ceil(wordsCount / wordsPerMinute);
    return estimatedTime;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <span>Carregando...</span>;
  }

  const readingTime = readingTimeEstimation(post);
  const { author, banner, content, title } = post.data;
  const { first_publication_date } = post;

  return (
    <>
      <Head>
        <title>{title} | Spacetraveling </title>
      </Head>

      <main>
        <article>
          <div
            className={styles.banner}
            style={{ background: `url(${banner.url})` }}
          />

          <div className={styles.container}>
            <div className={styles.post}>
              <h1>{title}</h1>

              <div className={styles.infos}>
                <time>
                  <FiCalendar />
                  {formatDate(first_publication_date)}
                </time>

                <span>
                  <FiUser />
                  {author}
                </span>

                <span>
                  <FiClock />
                  {`${readingTime} min`}
                </span>
              </div>

              <div className={styles.content}>
                {content.map((contentItem, index) => (
                  <div
                    key={`${index}`}
                    className={styles.contentItem}
                  >
                    <h2>{contentItem.heading}</h2>
                    <div
                      className={styles.contentBody}
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(contentItem.body),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 10,
    }
  );

  const paths = postsResponse.results.map(post => {
    return {
      params: { slug: post.uid },
    }
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});

  if(!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(item => {
        return {
          heading: item.heading,
          body: item.body,
        }
      }),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 8, //8 hours
  };
};
