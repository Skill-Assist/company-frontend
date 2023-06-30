import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  const user = {
    image: 'public/images/user-photo.svg',
    name: 'Felipe Saadi'
  }
  return (
    <>
      <Head>
        <link rel="icon" sizes='16x16' href='/static/favicon.svg' />
        <title>SkillAssist</title>
      </Head>
      <Component {...pageProps} {...user}/>
    </>
  )
}
