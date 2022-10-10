import { GetStaticProps, GetStaticPropsContext } from 'next'
import Link from 'next/link'
import * as React from 'react'

export interface IPostsPageProps {
  posts: any[]
}

type PostType = {
  id: string
  title: string
}

export default function PostsPage({ posts }: IPostsPageProps) {
  return (
    <ul>
      {posts?.map((item: PostType) => (
        <li key={item.id}>
          <Link href={`posts/${item.id}`}>
            <a>{item.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const getStaticProps: GetStaticProps<IPostsPageProps> = async (
  context: GetStaticPropsContext
) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await response.json()

  console.log('fetch')

  return {
    props: {
      posts: data.map(({ id, title }: PostType) => ({
        id,
        title,
      })),
    },
  }
}
