import { GetServerSideProps } from 'next';
import Image from "next/image";
import Home from "./home";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/home',
      permanent: true,
    },
  };
};

export default function Index() {
  return null;
}
