import { GetStaticPaths, GetStaticProps } from 'next'
import * as React from 'react'

export interface IPostDetailProps {
  post: any
}

export default function PostDetai({ post }: IPostDetailProps) {
  return <div>{post.title}</div>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await response.json()

  return {
    paths: data.map((item: any) => ({
      params: { postId: item.id + '' },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const postId = context.params?.postId

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  )
  const data = await response.json()

  return {
    props: {
      post: data,
    },
  }
}
