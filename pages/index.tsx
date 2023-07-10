import Layout from '@/components/Layout'

export default function Home(user: any) {
  return (
    <Layout sidebar footer header headerTitle='Seus Testes' active={0} user={user}>
      home
    </Layout>
  )
}
