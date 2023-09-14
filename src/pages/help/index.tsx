import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { toast } from 'react-hot-toast';

import Layout from '@/components/layout';
import Form from '@/components/form';

import { User } from '@/types/user';

import styles from './styles.module.scss';
import { TailSpin } from 'react-loader-spinner';

const Help = () => {
  const [user, setUser] = useState<User>();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('skillAssistUser');
    if (user) {
      setUser(JSON.parse(user));
      setPageLoading(false);
    }
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header active={2}>
        <div className="loadingContainer">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </Layout>
    );
  } else if (!user) {
    cookie.remove('token');
    toast.error('Erro de conexão. Verifique sua internet e tente novamente...', {
      icon: '📶',
    });
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }, 2000);
    return;
  } else
    return (
      <Layout header sidebar active={2}>
        <div className={styles.container}>
          <div className={styles.textContent}>
            <h1>
              Seu feedback é muito importante para o desenvolvimento da
              plataforma.
            </h1>
            <p>
              Se você tiver alguma dúvida ou sugestão, entre em contato conosco
              pelo formulário ao lado.
            </p>
            <p>Estamos aqui para te ajudar.</p>
          </div>
          <Form user={user} />
        </div>
      </Layout>
    );
};

export default Help;
