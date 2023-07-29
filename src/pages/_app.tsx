import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import Head from "next/head";
import cookies from "react-cookies";

import userService from "@/services/userService";

import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!cookies.load("token")) {
      router.push(`${process.env.NEXT_PUBLIC_LOGIN_URL}`);
    } else {
      const fetchData = async () => {
        const userResponse = await userService.getProfile();

        if (!userResponse){
          router.push(`${process.env.NEXT_PUBLIC_LOGIN_URL}`);
        }

        localStorage.setItem("user", JSON.stringify(userResponse.data));

        if (userResponse.data.roles.includes("recruiter") === false) {
          router.push(`${process.env.NEXT_PUBLIC_LOGIN_URL}`);
        } else {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" sizes='16x16' href='/favicon.svg' />
        <title>SkillAssist</title>
      </Head>
      {!loading && (
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      )
      }
    </>
  )
}
