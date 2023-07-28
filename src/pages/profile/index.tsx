import { FC } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";

import Layout from "@/components/layout";

import { User } from "@/types/user";

import styles from "./styles.module.scss";

interface Props {
  user: User;
}

const Profile: FC<Props> = ({user}: Props) => {
  return (
    <Layout
      header
      sidebar
      sidebarClosed
      goBack
      headerTitle="Profile"
      contentClassName={styles.p0}
    >
      <header className={styles.header}>
        <div className={styles.bannner}/>
        <div className={styles.mainInfos}>
          <Image src={user.logo} height={100} width={100} alt="profile_picture" />
          <div>
            <h2>{user.name}</h2>
            <span>{user.email}</span>
          </div>
        </div>
      </header>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { token } = req.cookies;

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const user = await userResponse.json();

  return {
    props: {
      user,
    },
  };
};


export default Profile;
